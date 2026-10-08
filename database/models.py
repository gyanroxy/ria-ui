"""
RIA (Roxy Intelligent AI) Telecalling Agent — Production SQLAlchemy Models
Designed for Python 3.11+, FastAPI, and PostgreSQL 15+
"""

from datetime import datetime, date
from decimal import Decimal
from enum import Enum
from typing import List, Optional, Any, Dict
import uuid

from sqlalchemy import (
    String,
    Integer,
    Numeric,
    Boolean,
    Text,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Enum as SQLEnum,
    func
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from pydantic import BaseModel, ConfigDict, Field


# -----------------------------------------------------------------------------
# Enums
# -----------------------------------------------------------------------------
class UserRole(str, Enum):
    OW = "OW"
    CM = "CM"
    CE = "CE"
    AC = "AC"
    PA = "PA"
    TA = "TA"


class UserStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    SUSPENDED = "Suspended"


class AutonomyLevel(str, Enum):
    L0 = "L0"
    L1 = "L1"
    L2 = "L2"


class BatchStatus(str, Enum):
    SCHEDULED = "Scheduled"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"


class RescheduleType(str, Enum):
    CUSTOMER_REQUESTED = "customer_requested"
    NO_LIFT_RETRY = "no_lift_retry"
    BUSY_RETRY = "busy_retry"


class ReschedulePriority(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    NORMAL = "Normal"
    LOW = "Low"


class RescheduleStatus(str, Enum):
    QUEUED = "Queued"
    DIALING = "Dialing"
    COMPLETED = "Completed"
    EXHAUSTED = "Exhausted"
    CANCELLED = "Cancelled"


class PtpStatus(str, Enum):
    DUE = "due"
    UPCOMING = "upcoming"
    KEPT = "kept"
    BROKEN = "broken"


class TicketSeverity(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class TicketStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


class InvoiceStatus(str, Enum):
    UNPAID = "unpaid"
    PARTIALLY_PAID = "partially_paid"
    PAID = "paid"
    DISPUTED = "disputed"


# -----------------------------------------------------------------------------
# Base
# -----------------------------------------------------------------------------
class Base(DeclarativeBase):
    pass


# -----------------------------------------------------------------------------
# SQLAlchemy Models
# -----------------------------------------------------------------------------
class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    gstin: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    caller_id: Mapped[str] = mapped_column(String(50), default="ROXY-HYD")
    config: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    users: Mapped[List["User"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
    retailers: Mapped[List["Retailer"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
    batches: Mapped[List["CallBatch"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole, name="user_role_enum"), default=UserRole.CE)
    phone: Mapped[Optional[str]] = mapped_column(String(30))
    status: Mapped[UserStatus] = mapped_column(SQLEnum(UserStatus, name="user_status_enum"), default=UserStatus.ACTIVE)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    tenant: Mapped["Tenant"] = relationship(back_populates="users")


class Retailer(Base):
    __tablename__ = "retailers"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_name: Mapped[Optional[str]] = mapped_column(String(255))
    business_name: Mapped[Optional[str]] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    city: Mapped[str] = mapped_column(String(100), default="Hyderabad")
    preferred_lang: Mapped[str] = mapped_column(String(50), default="Telugu")
    aging_bucket: Mapped[str] = mapped_column(String(30), default="1-30d")
    total_outstanding: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0.00"))
    overdue_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0.00"))
    credit_limit: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0.00"))
    credit_period: Mapped[str] = mapped_column(String(50), default="30 Days")
    last_call_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    last_ptp_date: Mapped[Optional[date]] = mapped_column(Date)
    last_disposition: Mapped[Optional[str]] = mapped_column(String(100))
    sentiment_score: Mapped[int] = mapped_column(Integer, default=80)
    autonomy_level: Mapped[AutonomyLevel] = mapped_column(SQLEnum(AutonomyLevel, name="autonomy_level_enum"), default=AutonomyLevel.L2)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    tenant: Mapped["Tenant"] = relationship(back_populates="retailers")
    invoices: Mapped[List["Invoice"]] = relationship(back_populates="retailer", cascade="all, delete-orphan")
    calls: Mapped[List["Call"]] = relationship(back_populates="retailer", cascade="all, delete-orphan")
    ptp_commitments: Mapped[List["PtpCommitment"]] = relationship(back_populates="retailer", cascade="all, delete-orphan")


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    retailer_id: Mapped[str] = mapped_column(ForeignKey("retailers.id", ondelete="CASCADE"), nullable=False)
    invoice_number: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    due_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(SQLEnum(InvoiceStatus, name="invoice_status_enum"), default=InvoiceStatus.UNPAID)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    retailer: Mapped["Retailer"] = relationship(back_populates="invoices")


class CallBatch(Base):
    __tablename__ = "call_batches"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    imported_by_user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    imported_by_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    total_calls: Mapped[int] = mapped_column(Integer, default=0)
    completed_calls: Mapped[int] = mapped_column(Integer, default=0)
    connected_calls: Mapped[int] = mapped_column(Integer, default=0)
    ptp_count: Mapped[int] = mapped_column(Integer, default=0)
    ptp_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0.00"))
    dispute_count: Mapped[int] = mapped_column(Integer, default=0)
    no_lift_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[BatchStatus] = mapped_column(SQLEnum(BatchStatus, name="batch_status_enum"), default=BatchStatus.SCHEDULED)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    tenant: Mapped["Tenant"] = relationship(back_populates="batches")
    calls: Mapped[List["Call"]] = relationship(back_populates="batch")


class Call(Base):
    __tablename__ = "calls"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), primary_key=True, server_default=func.now())
    batch_id: Mapped[Optional[str]] = mapped_column(ForeignKey("call_batches.id", ondelete="SET NULL"))
    retailer_id: Mapped[str] = mapped_column(ForeignKey("retailers.id", ondelete="CASCADE"), nullable=False)
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    language: Mapped[str] = mapped_column(String(50), default="Telugu")
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    duration_display: Mapped[str] = mapped_column(String(30), default="0m 0s")
    disposition: Mapped[str] = mapped_column(String(150), nullable=False)
    ptp_committed_date: Mapped[Optional[date]] = mapped_column(Date)
    ptp_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(14, 2))
    sentiment_score: Mapped[int] = mapped_column(Integer, default=80)
    autonomy_level: Mapped[AutonomyLevel] = mapped_column(SQLEnum(AutonomyLevel, name="autonomy_level_enum"), default=AutonomyLevel.L2)
    audio_recording_url: Mapped[Optional[str]] = mapped_column(String(500))
    turns: Mapped[List[Dict[str, Any]]] = mapped_column(JSONB, default=list)
    ai_summary: Mapped[Optional[str]] = mapped_column(Text)

    batch: Mapped[Optional["CallBatch"]] = relationship(back_populates="calls")
    retailer: Mapped["Retailer"] = relationship(back_populates="calls")


class CallRescheduleQueue(Base):
    __tablename__ = "call_reschedule_queue"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    retailer_id: Mapped[str] = mapped_column(ForeignKey("retailers.id", ondelete="CASCADE"), nullable=False)
    batch_id: Mapped[Optional[str]] = mapped_column(ForeignKey("call_batches.id", ondelete="SET NULL"))
    source_call_id: Mapped[Optional[str]] = mapped_column(String(50))
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    outstanding_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0.00"))
    type: Mapped[RescheduleType] = mapped_column(SQLEnum(RescheduleType, name="reschedule_type_enum"), default=RescheduleType.NO_LIFT_RETRY)
    priority: Mapped[ReschedulePriority] = mapped_column(SQLEnum(ReschedulePriority, name="reschedule_priority_enum"), default=ReschedulePriority.HIGH)
    scheduled_for: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    attempt_number: Mapped[int] = mapped_column(Integer, default=1)
    max_attempts: Mapped[int] = mapped_column(Integer, default=3)
    ai_note: Mapped[Optional[str]] = mapped_column(Text)
    last_outcome: Mapped[Optional[str]] = mapped_column(String(150))
    status: Mapped[RescheduleStatus] = mapped_column(SQLEnum(RescheduleStatus, name="reschedule_status_enum"), default=RescheduleStatus.QUEUED)
    dialed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class PtpCommitment(Base):
    __tablename__ = "ptp_commitments"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    retailer_id: Mapped[str] = mapped_column(ForeignKey("retailers.id", ondelete="CASCADE"), nullable=False)
    source_call_id: Mapped[Optional[str]] = mapped_column(String(50))
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[PtpStatus] = mapped_column(SQLEnum(PtpStatus, name="ptp_status_enum"), default=PtpStatus.UPCOMING)
    autonomy_level: Mapped[AutonomyLevel] = mapped_column(SQLEnum(AutonomyLevel, name="autonomy_level_enum"), default=AutonomyLevel.L2)
    payment_link_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    payment_link_url: Mapped[Optional[str]] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    retailer: Mapped["Retailer"] = relationship(back_populates="ptp_commitments")


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    retailer_id: Mapped[Optional[str]] = mapped_column(ForeignKey("retailers.id", ondelete="SET NULL"))
    source_call_id: Mapped[Optional[str]] = mapped_column(String(50))
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(150), nullable=False)
    severity: Mapped[TicketSeverity] = mapped_column(SQLEnum(TicketSeverity, name="ticket_severity_enum"), default=TicketSeverity.MEDIUM)
    assigned_to_user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    assigned_to_name: Mapped[str] = mapped_column(String(255), default="Unassigned")
    status: Mapped[TicketStatus] = mapped_column(SQLEnum(TicketStatus, name="ticket_status_enum"), default=TicketStatus.OPEN)
    resolution_note: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
