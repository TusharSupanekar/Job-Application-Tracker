# Job Application Tracker

> A secure, AI-assisted backend for organizing job applications, managing resumes,
> and measuring how well a resume matches a job description.

[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)

## Overview

Job Application Tracker is a learning-focused REST API built to make the job search
more organized. Each user gets a private workspace for tracking applications,
storing text-based resumes, viewing application statistics, and running AI-powered
resume-to-job analysis.

The backend is functional. A React frontend is planned but has not been started yet.

## Highlights

- Secure registration and login with bcrypt password hashing and JWT authentication
- Private, user-owned job and resume data
- Complete job and resume CRUD operations
- Job filtering, search, sorting, and pagination
- Dashboard-ready application statistics grouped by status
- Resume assignment to individual job applications
- AI-powered resume and job-description matching with Google Gemini
- Smart analysis caching using SHA-256 content fingerprints
- Integration tests for authentication, ownership, jobs, and resumes

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| API framework | Express 5 |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Tokens |
| Password security | bcryptjs |
| AI integration | Google Gen AI SDK |
| Testing | Jest and Supertest |
| Module system | ES Modules |
| Development server | nodemon |
| Frontend | React (planned) |

## Architecture

```text
Standard request
Client -> Route -> Auth Middleware -> Controller -> Model -> MongoDB

AI analysis request
Client -> Route -> Auth Middleware -> Controller -> AI Service -> Gemini
                                                    |
                                                    -> MongoDB cache
```

```text
Job_Tracker/
|-- client/                       # React frontend (planned)
|-- server/
|   |-- server.js                 # Database connection and server startup
|   |-- package.json
|   |-- jest.config.js            # Jest configuration
|   |-- tests/
|   |   |-- setup.js              # Test database setup and cleanup
|   |   |-- auth.test.js
|   |   |-- job.test.js
|   |   `-- resume.test.js
|   `-- src/
|       |-- app.js                # Express configuration and route mounting
|       |-- config/
|       |   `-- db.js             # MongoDB connection
|       |-- controllers/
|       |   |-- aiController.js
|       |   |-- authController.js
|       |   |-- jobController.js
|       |   `-- resumeController.js
|       |-- middleware/
|       |   `-- authMiddleware.js # JWT protection
|       |-- models/
|       |   |-- Job.js
|       |   |-- Resume.js
|       |   `-- User.js
|       |-- routes/
|       |   |-- aiRoutes.js
|       |   |-- authRoutes.js
|       |   |-- jobRoutes.js
|       |   `-- resumeRoutes.js
|       `-- services/
|           `-- aiService.js      # Gemini integration
`-- README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [MongoDB Atlas](https://www.mongodb.com/atlas) database
- A [Google AI API key](https://ai.google.dev/) for resume analysis

### Installation

```bash
git clone https://github.com/TusharSupanekar/Job-Application-Tracker.git
cd Job-Application-Tracker/server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_google_ai_api_key
```

Start the development server:

```bash
npm run dev
```

Or run it normally:

```bash
npm start
```

The API runs at `http://localhost:5000` by default.

## Testing

The backend includes 10 Jest and Supertest integration tests covering:

- Registration and login validation
- User creation and JWT login flow
- Missing and invalid authentication tokens
- Authenticated job and resume creation
- Job and resume ownership isolation between users

Create `server/.env.test` with a dedicated test database:

```env
MONGO_URI_TEST=your_dedicated_test_database_connection_string
JWT_SECRET=your_test_jwt_secret
```

> **Important:** The test setup deletes every document from every collection before
> each test. Never point `MONGO_URI_TEST` at a development or production database.

Run the suite from `server/`:

```bash
npm test
```

## Authentication

Register or log in to receive a JWT. Send that token with every protected request:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens currently expire after one hour.

## API Reference

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create a user account |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |

### Jobs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/jobs` | Protected | Create a job application |
| `GET` | `/api/jobs` | Protected | List the current user's jobs |
| `GET` | `/api/jobs/stats` | Protected | Get application counts by status |
| `GET` | `/api/jobs/:id` | Protected | Get one job application |
| `PUT` | `/api/jobs/:id` | Protected | Update one job application |
| `DELETE` | `/api/jobs/:id` | Protected | Delete one job application |
| `PUT` | `/api/jobs/:id/resume` | Protected | Assign a resume to a job |

The job list supports these query parameters:

| Parameter | Example | Purpose |
| --- | --- | --- |
| `status` | `Applied` | Filter by application status |
| `workType` | `Remote` | Filter by work arrangement |
| `source` | `LinkedIn` | Filter by application source |
| `search` | `engineer` | Search company and role names |
| `sort` | `oldest` | Sort by application date; newest is default |
| `page` | `2` | Select a result page |
| `limit` | `10` | Set the number of results per page |

Example:

```http
GET /api/jobs?status=Applied&workType=Remote&search=developer&page=1&limit=10
```

### Resumes

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/resumes` | Protected | Create a text-based resume |
| `GET` | `/api/resumes` | Protected | List the current user's resumes |
| `GET` | `/api/resumes/:id` | Protected | Get one resume |
| `PUT` | `/api/resumes/:id` | Protected | Update a resume |
| `DELETE` | `/api/resumes/:id` | Protected | Delete a resume |

### AI Analysis

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/ai/analyze-job/:id` | Protected | Analyze the assigned resume against a job |

Before analysis, the job must have both a `jobDescription` and an assigned resume.
The result includes:

- Match score
- Matched skills
- Missing skills
- Summary
- Improvement suggestions

Analyses are cached until the resume text or job description changes. Add
`?force=true` to request a fresh analysis.

## Example Workflow

1. Register a user with `POST /api/auth/register`.
2. Log in with `POST /api/auth/login` and copy the returned token.
3. Create a resume with `POST /api/resumes`.
4. Create a job containing a `jobDescription` with `POST /api/jobs`.
5. Assign the resume using `PUT /api/jobs/:id/resume`.
6. Run the match analysis with `POST /api/ai/analyze-job/:id`.

## Job Data

Job applications support:

- Company and role
- Status: `Saved`, `Applied`, `Interview`, `Offer`, `Rejected`, or `Withdrawn`
- Location and job URL
- Application date and notes
- Work type: `Remote`, `Hybrid`, or `On-site`
- Source: `LinkedIn`, `Indeed`, `Glassdoor`, `Company Website`, `Referral`, or `Other`
- Job description
- Assigned resume
- Cached AI analysis

## Project Status

The backend currently includes authentication, user-owned job management, resume
CRUD, statistics, AI analysis, and backend integration tests. Upcoming work includes:

- Build the React frontend
- Expand automated coverage for AI analysis, queries, statistics, and full CRUD flows
- Improve resume deletion and reference cleanup
- Add consistent ObjectId validation to resume endpoints
- Expand user account functionality

## Learning Goals

This project is built manually in small steps to practice:

- REST API design and Express routing
- Controller/model separation
- MongoDB and Mongoose data modeling
- Authentication and authorization
- User-owned resource protection
- Search, filters, pagination, and aggregation
- External AI service integration
- Cache invalidation using content hashes

---

Built as a hands-on full-stack learning project.
