"""
RIA Telecalling Agent — Production Async Database Repository & Stored Queries
Ultra-fast asynchronous queries using SQLAlchemy 2.0 AsyncSession & asyncpg
"""

from datetime import datetime, date
from decimal import Decimal
from typing import List, Optional, Dict, Any

from sqlalchemy import select, update, insert, func, and_, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession

from .models import (
    Tenant,
    User,
    Retailer,
    Invoice,
    CallBatch,
    Call,
    CallRescheduleQueue,
    PtpCommitment,
    Ticket,
    RescheduleStatus,
    PtpStatus,
    BatchStatus
)


class RescheduleQueueRepository:
    """
    Handles autonomous background dialer queue operations with zero human effort.
    Uses PostgreSQL lock-free SKIP LOCKED to support multi-worker concurrency.
    """

    @staticmethod
    async def fetch_and_lock_due_calls(
        session: AsyncSession,
        tenant_id: str,
        limit: int = 10
    ) -> List[CallRescheduleQueue]:
        """
        Fetches pending calls where scheduled_for <= NOW(), locking them atomically
        so other worker threads or containers will not double-dial the same customer.
        """
        now = datetime.now()
        stmt = (
            select(CallRescheduleQueue)
            .where(
                and_(
                    CallRescheduleQueue.tenant_id == tenant_id,
                    CallRescheduleQueue.status == RescheduleStatus.QUEUED,
                    CallRescheduleQueue.scheduled_for <= now,
                )
            )
            .order_by(
                CallRescheduleQueue.priority.desc(),
                CallRescheduleQueue.scheduled_for.asc()
            )
            .limit(limit)
            .with_for_update(skip_locked=True)
        )
        result = await session.execute(stmt)
        items = result.scalars().all()

        # Transition status to Dialing
        for item in items:
            item.status = RescheduleStatus.DIALING
            item.dialed_at = now

        await session.commit()
        return items

    @staticmethod
    async def complete_call_and_requeue_if_unlifted(
        session: AsyncSession,
        queue_id: str,
        was_connected: bool,
        new_disposition: str,
        customer_requested_time: Optional[datetime] = None,
        ai_note: Optional[str] = None,
        max_attempts: int = 3
    ) -> CallRescheduleQueue:
        """
        Automatically reschedules unlifted calls 5 minutes later,
        or queues customer-requested callbacks.
        """
        stmt = select(CallRescheduleQueue).where(CallRescheduleQueue.id == queue_id)
        result = await session.execute(stmt)
        item = result.scalar_one_or_none()
        if not item:
            raise ValueError(f"Queue item {queue_id} not found")

        if was_connected:
            if customer_requested_time:
                # Customer answered and asked to call back later
                item.status = RescheduleStatus.QUEUED
                item.scheduled_for = customer_requested_time
                item.type = "customer_requested"
                item.ai_note = ai_note or "Customer requested callback"
                item.last_outcome = new_disposition
            else:
                # Successfully resolved / PTP noted
                item.status = RescheduleStatus.COMPLETED
                item.last_outcome = new_disposition
        else:
            # Unlifted / busy call
            if item.attempt_number >= max_attempts:
                # Exhausted attempts -> prompt field visit
                item.status = RescheduleStatus.EXHAUSTED
                item.last_outcome = f"Max {max_attempts} attempts exceeded"
            else:
                # 5-MINUTE FAST AUTO-RETRY
                from datetime import timedelta
                item.status = RescheduleStatus.QUEUED
                item.attempt_number += 1
                item.scheduled_for = datetime.now() + timedelta(minutes=5)
                item.type = "no_lift_retry"
                item.ai_note = ai_note or f"Auto-retry #{item.attempt_number} scheduled in 5 mins"
                item.last_outcome = new_disposition

        await session.commit()
        return item


class BatchReportRepository:
    """
    Handles campaign batch analytics and CSV report generation directly from PostgreSQL.
    """

    @staticmethod
    async def get_batch_report_data(
        session: AsyncSession,
        batch_id: str
    ) -> Dict[str, Any]:
        """
        Aggregates batch metadata, total calls, connected rate, PTP committed sum,
        and all turn records in a single high-speed query.
        """
        batch_stmt = select(CallBatch).where(CallBatch.id == batch_id)
        batch_res = await session.execute(batch_stmt)
        batch = batch_res.scalar_one_or_none()
        if not batch:
            raise ValueError(f"Batch {batch_id} not found")

        calls_stmt = (
            select(Call)
            .where(Call.batch_id == batch_id)
            .order_by(Call.created_at.desc())
        )
        calls_res = await session.execute(calls_stmt)
        calls = calls_res.scalars().all()

        return {
            "batch": batch,
            "calls": calls,
            "total_calls": len(calls),
            "connected_calls": sum(1 for c in calls if c.duration_seconds > 0),
            "ptp_sum": sum(c.ptp_amount or Decimal("0.00") for c in calls if c.ptp_amount),
        }
