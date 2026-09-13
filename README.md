# AI-Powered Automatic Railway Maintenance & Block Planning System
### Indian Railways • Smart India Hackathon (SIH 2026) • Ministry of Railways

A full-stack, production-grade **Railway Maintenance Control Center** designed for fixed infrastructure coordination across Engineering (Track/TMS), Traction Distribution (Electrical/TDMS), Signalling (SMMS), and Telecommunications.

---

## 🌟 Key Architecture & Capabilities

### 1. Dual Persona Separation & Strict RBAC
* **Lower HOD Workspaces** (Electrical, Signal, Civil, Telecom, Mechanical):
  * Department-isolated dashboards, problem reporting wizard (4 steps) with live **AI Initial Assessment Preview**, execution tracking with live progress sliders (`0% -> 25% -> 50% -> 75% -> 100%`), delay reporting, and **Maintenance Completion Reports (MCR)**.
  * Strict authority boundary: Lower HOD cannot approve their own requests or close MCRs.
* **Higher HOD Command Center** (Head of All Departments):
  * Executive command dashboard with real-time database KPIs, interactive Corridor Status Visual Monitor, and Department Matrix.
  * **AI Block Planner** powered by constraint programming with **8-dimension Conflict Detection** (Train, Corridor, Time, Manpower, Resource, Safety, Isolation, Existing Block) and **Block Fusion** (achieving 50–66% reduction in corridor blockage).
  * Human-in-the-Loop decision controls: `APPROVE PLAN`, `MODIFY PLAN`, `REJECT PLAN` (with mandatory audit justification).
  * **Live Operations & Dynamic Re-planning**: Anomaly injection and on-the-fly schedule re-optimization.
  * **MCR Quality Verification Gate**: Close request, send for rework (mandatory instructions), or mark partial.

### 2. Persistent Top-Right User Identity Rule
Every authenticated screen prominently displays:
* User Avatar & Full Name
* Role Badge (`HIGHER HOD` or `LOWER HOD • ELECTRICAL`)
* Department Scope (`All Departments` or `Electrical Department`)
* Profile Dropdown with Employee ID, Active status, and **1-Click Persona Quick-Switcher**
* Context Indicator ("You are here") below every page title

---

## 🚀 Quick Start Guide

### 1. Backend (FastAPI + OR-Tools / CP Constraint Engine + SQLite/PostgreSQL)
```powershell
# Navigate to workspace root
cd "d:\SIH 2026 2.0"

# (Optional) Re-seed realistic synthetic Indian Railways dataset:
python -m backend.seed_data

# Run FastAPI backend server:
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
* API Documentation: `http://127.0.0.1:8000/docs`
* Health Check: `http://127.0.0.1:8000/api/health`

### 2. Frontend (React 18 + TypeScript + Tailwind CSS + Lucide + Recharts)
```powershell
# In a new terminal:
cd "d:\SIH 2026 2.0\frontend"

# Launch development server:
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```
* Open in browser: **`http://127.0.0.1:5173`**

---

## 👤 Official Demo Accounts

| Role | Name | Department | Employee ID | Password |
|---|---|---|---|---|
| **Higher HOD** | Keval Rana | Head of All Departments | `hod001` | `hod123` |
| **Lower HOD** | Rahul Patel | Electrical (TRD / OHE) | `elec001` | `elec123` |
| **Lower HOD** | Amit Shah | Signalling (SMMS) | `sig001` | `sig123` |
| **Lower HOD** | Rajesh Sharma | Civil Engineering (Track/TMS) | `civil001` | `civil123` |
| **Lower HOD** | Vikram Verma | Telecommunications | `tel001` | `tel123` |
| **Admin** | System Administrator | CRIS / Network Master Data | `admin001` | `admin123` |

---

## 📊 Synthetic Dataset Statistics
* **70 Indian Railway Stations**: Major junctions (NDLS, BCT, CNB, HWH, BPL, GZB, ALJN, etc.)
* **200 Corridors**: Double & quadruple trunk lines with speed and status tracking
* **400 Fixed Infrastructure Assets**: OHE cantilevers, insulators, point machines, track circuits, rail joints, OFC nodes
* **500 Train Schedules**: Rajdhani Express, Vande Bharat, Shatabdi, Superfast, and Freight paths
* **200 Maintenance Requests**: Realistic multi-status lifecycle records
* **100 Manpower Gangs & 100 Machinery Resources**: Tower inspection wagons, tamping machines, rail cranes

---

## 🏗️ Technology Stack
* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, React Router v6, Axios
* **Backend**: FastAPI, Google OR-Tools CP-SAT / Railway Constraint Engine, SQLAlchemy ORM, Pydantic v2
* **Database**: SQLite (with WAL mode enabled) / Native PostgreSQL via `DATABASE_URL`
