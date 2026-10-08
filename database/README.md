# 🗄️ RIA Telecalling Agent — Production Database Architecture

This directory contains the production-grade **PostgreSQL** database architecture designed for RIA, scaling to **10,000+ voice calls/day** (~300,000 calls/month) with sub-millisecond query latencies.

---

## 📁 Directory Files

| File | Description |
| :--- | :--- |
| **[`schema.sql`](./schema.sql)** | Complete PostgreSQL DDL schema with partitioning, JSONB transcripts, indices, and lock-free queue stored procedures. |
| **[`seed_data.sql`](./seed_data.sql)** | Ready-to-run seed data with realistic retailers, invoices, calls, bilingual transcripts, batches, and reschedule queues. |
| **[`models.py`](./models.py)** | Production **SQLAlchemy 2.0 Async** Python models for the backend. |
| **[`queries.py`](./queries.py)** | Async database repository with lock-free `SKIP LOCKED` autonomous dialer query engine. |

---

## 🚀 Part 1: Local Setup on Windows (PostgreSQL + pgAdmin)

### Step 1: Install PostgreSQL & pgAdmin on Windows
1. Download the PostgreSQL Windows Installer from the official website:
   👉 **[PostgreSQL Windows Official Download](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)** (Select Version 16 or 15).
2. Run the installer:
   - Keep default port: `5432`.
   - Set a master password (e.g. `postgres` or `admin123`).
   - Ensure **pgAdmin 4** and **Command Line Tools** are checked.
3. Finish the installation.

### Step 2: Create the Database in pgAdmin
1. Open **pgAdmin 4** from your Windows Start Menu.
2. Enter your master password to connect to the local server.
3. In the left sidebar: Right-click **Databases** ➔ **Create** ➔ **Database...**.
4. Name the database: `ria_db` and click **Save**.

### Step 3: Run the Schema & Seed Data
1. Select `ria_db` in the left tree.
2. Open the Query Tool from the top menu: **Tools** ➔ **Query Tool** (or click the database icon with `>_`).
3. Open and run **[`schema.sql`](./schema.sql)**:
   - Click the folder icon in pgAdmin to open `schema.sql` (or paste its contents).
   - Press **Execute / Run (F5)**.
   - *Message: "Query returned successfully."*
4. Open and run **[`seed_data.sql`](./seed_data.sql)**:
   - Paste or open `seed_data.sql`.
   - Press **Execute / Run (F5)**.

Your local database is now 100% configured, partitioned, and populated with data!

---

## 🌐 Part 2: Production Deployment on Google Cloud (GCP)

### 1. Google Cloud SQL (PostgreSQL 16)
- **Instance Type**: `db-custom-4-16384` (4 vCPUs, 16 GB RAM) with SSD storage and auto-increase enabled.
- **High Availability**: Regional configuration with automatic failover replica.
- **Automated Backups**: Daily automated snapshot backups with 7-day point-in-time recovery (PITR).

### 2. Audio Storage Architecture
- Raw audio `.wav` recordings from Smallest.ai / Telephony are streamed directly to **Google Cloud Storage (GCS)** buckets (e.g., `gs://ria-audio-recordings-prod/`).
- The database only stores the secure, signed URL in `calls.audio_recording_url`, keeping PostgreSQL lean, fast, and cached in RAM.

### 3. Connection Pooling
- Use **PgBouncer** or Python `asyncpg` connection pool (`min_size=10, max_size=50`) connected via Google Cloud SQL Auth Proxy.

---

## 🏗️ Part 3: Architecture Highlights & Data Flows

```
┌───────────────────────────┐      ┌──────────────────────────┐
│  Python Backend (FastAPI) │ ───> │  PostgreSQL 16 (GCP)     │
│  - OpenAI Brain (NLP)     │      │  - Partitioned `calls`   │
│  - Smallest.ai (TTS/STT)  │      │  - Lock-free `queue`     │
└───────────────────────────┘      └──────────────────────────┘
             │                                   │
             ▼                                   ▼
┌───────────────────────────┐      ┌──────────────────────────┐
│ GCS Audio Bucket (Record) │      │  RIA Next.js Frontend    │
│ gs://ria-recordings-prod/ │      │  (Dashboard, Calls, etc.)│
└───────────────────────────┘      └──────────────────────────┘
```

### Table Overview:
1. **`tenants`**: Multi-tenant settings, voice parameters, and calling rules.
2. **`users`**: Role-based access control (`OW`, `CM`, `CE`, `AC`, `PA`, `TA`).
3. **`retailers`**: 360° Master ledger, outstanding ₹, overdue balance, and contact history.
4. **`invoices`**: Invoice numbers, amounts, due dates, and dispute statuses.
5. **`call_batches`**: Campaign batch imports (`name`, `total_calls`, `connected_calls`, `ptp_amount`).
6. **`calls` (Monthly Partitioned)**: High-speed turn-by-turn bilingual transcripts (`turns` JSONB) and recording URLs.
7. **`call_reschedule_queue`**: Autonomous 5-min fast retries and customer-requested callback scheduler with `SKIP LOCKED` concurrency.
8. **`ptp_commitments`**: Promise-to-Pay tracking and WhatsApp payment link dispatch.
9. **`tickets`**: Dispute escalations, claims, and field collection assignments.
10. **`audit_logs`**: Immutable regulatory compliance trail.

---

## 🐍 Part 4: Python Connection Example (FastAPI + asyncpg)

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

DATABASE_URL = "postgresql+asyncpg://postgres:admin123@localhost:5432/ria_db"

engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_recycle=3600,
    echo=False
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```
