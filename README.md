# Professional Engineering Portfolio & CMS

A high-performance full-stack personal portfolio and dynamic content management system (CMS) engineered with **React 18**, **Python FastAPI**, **NoSQL MongoDB**, **Cloudinary Media API**, and **Google SMTP Email Services**.

Designed with a bespoke **White & Light Blue** palette, clean typography, responsive layouts, and zero emojis.

---

## Architecture Overview

The system is bifurcated into two operational phases:

### Phase 1: Client Portfolio (Public View)
- **Hero & Identity**: Professional introduction, live availability indicator, custom avatar with subtle glowing halo, and primary/secondary call-to-actions.
- **Philosophy & Impact**: Key engineering metrics (Years of experience, shipped systems, uptime SLA) and architectural guiding principles.
- **Competencies & Skills**: Categorized technical skills matrix (Frontend, Backend, Database, Cloud & Integrations) with interactive tags.
- **Track Record & Timeline**: Career timeline detailing engineering roles, achievements, and technology stacks.
- **Production Projects Gallery**: Category-filtered showcase with Cloudinary image previews, tech stack badges, live demo links, GitHub repo links, and interactive architectural detail modals.
- **Resume Section**: Instant PDF download and browser preview powered by Cloudinary.
- **Dynamic Enquiry Form**: Fully customizable client contact form that saves submissions into MongoDB and immediately triggers an email notification to the owner via Google SMTP.
- **Engineering Footer**: Navigation shortcuts, social media links, and live service health indicators.

### Phase 2: Admin Control Center (Private CMS)
- **JWT Authentication**: Secure login at `admin@portfolio.com` (default initial password: `Admin@123456`).
- **Real-Time Integration Health**: Live monitoring of MongoDB connection, Cloudinary CDN status, and Google SMTP authentication.
- **Portfolio Content Manager**: Direct editing of all portfolio copy, bio paragraphs, numerical statistics, skills matrix, career milestones, and social profile links with MongoDB persistence.
- **Projects Manager**: Create, edit, delete, and reorder projects, with integrated **Cloudinary Image Upload**.
- **Resume & Media Vault**: Dedicated space to upload updated PDF resumes directly to Cloudinary, toggle client visibility, and copy CDN image URLs.
- **Dynamic Enquiry Form Builder**: Add, edit, reorder, toggle, or delete fields (text, email, select dropdowns, textarea) on the client enquiry form.
- **Client Inquiries Inbox**: Review incoming client leads, filter by unread/read/archived, inspect dynamic form key-value submissions, and reply directly via email.
- **Security & Config Center**: Change admin password, with configuration guides for MongoDB Atlas clusters, Google SMTP App Passwords, and Cloudinary keys.

---

## Tech Stack Summary

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Frontend** | React 18 + Vite | Modular component architecture, Tailwind CSS, Lucide icons, Axios |
| **Backend** | Python 3.12+ / FastAPI | Asynchronous I/O (`uvloop`), Pydantic models, JWT Bearer auth, CORS |
| **Database** | MongoDB (NoSQL) | Async Motor driver, indexing, flexible schemas for content and dynamic forms |
| **Media Storage** | Cloudinary | CDN delivery, automated image optimizations, PDF resume hosting |
| **Email Service** | Google SMTP | Asynchronous background dispatch, HTML emails with client submission tables |

---

## Quick Start & Running Locally

### 1. Backend (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create & activate virtual environment (if not already active)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server with reload
uvicorn app.main:app --reload --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### 2. Frontend (React + Vite)

```bash
# In a separate terminal, navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
- Client Portfolio: [http://localhost:5173](http://localhost:5173)

---

## Environment Configuration (`backend/.env`)

Configure your credentials in `backend/.env` (see `backend/.env.example` for reference):

### 1. MongoDB Database Cluster (NoSQL)
Provide your MongoDB Atlas cluster connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=portfolio_db
```
*(Note: If no cluster URI is provided, the backend seamlessly uses an in-memory fallback repository so you can test everything immediately without downtime.)*

### 2. Cloudinary Setup
Get your credentials at [console.cloudinary.com](https://console.cloudinary.com/):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
*(Note: When Cloudinary is not configured, uploads fall back to local disk storage at `backend/uploads/`.)*

### 3. Google SMTP Setup (Email Notifications)
When a client fills out the enquiry form, an email is dispatched directly to your inbox.
For Google SMTP:
1. Go to your Google Account ([myaccount.google.com](https://myaccount.google.com/)) → **Security**.
2. Turn on **2-Step Verification**.
3. Go to **App Passwords** and generate a new password (e.g., named "Portfolio").
4. Enter the 16-character password into `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
SMTP_FROM_NAME="Portfolio Inquiry System"
NOTIFICATION_RECEIVER_EMAIL=your_email@gmail.com
```

### 4. Admin Credentials & JWT
```env
JWT_SECRET=super_secure_random_key_for_jwt
ADMIN_EMAIL=admin@portfolio.com
ADMIN_INITIAL_PASSWORD=Admin@123456
```

---

## Admin Portal Access

The admin panel is **not linked anywhere on the public site**. Open it directly:

- Dev: [http://localhost:5173/admin](http://localhost:5173/admin)
- Production: `http://<your-server-ip>/admin`

Sign in with `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` from `backend/.env`, then change the password under **Security & Config**.

### Deploying so `/admin` works

`/admin` is a client-side route, so the server must return `index.html` for unknown paths:

- **FastAPI only:** run `npm run build` in `frontend/`; the backend automatically serves `frontend/dist` with SPA fallback, so `http://<ip>:8000/admin` works.
- **Nginx:** use `try_files $uri /index.html;` in the `location /` block and proxy `/api` to the backend.
