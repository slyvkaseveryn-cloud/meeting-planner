# Meeting Planner Service — Architecture Specification

## 1. Overview
The Meeting Planner Service is a lightweight full-stack web application designed to manage, schedule, and view business meetings. It serves as the baseline service for continuous deployment workflows using Docker, Docker Compose, and AWS cloud primitives.

## 2. Technology Stack & Runtime Versions
- **Backend**: Python 3.13, FastAPI, SQLAlchemy 2.0, Pydantic v2, Uvicorn
- **Database & Migrations**: PostgreSQL 16 (Alpine), Alembic
- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Web Server / Reverse Proxy**: Nginx (Alpine) for serving frontend SPA assets
- **Containerization**: Docker, Docker Compose (Compose Spec v3.8)
- **Cloud Provider**: AWS (IAM, EC2 / ECS, ECR, S3, CloudWatch)

## 3. Network Architecture & Exposed Ports
| Service    | Internal Container Port | Host Port Binding | Protocol | Description |
|------------|-------------------------|-------------------|----------|-------------|
| Frontend   | 80                      | 80:80 / 3000:80   | HTTP     | SPA Dashboard served via Nginx |
| Backend    | 8000                    | 8000:8000         | HTTP     | FastAPI REST API with Swagger docs |
| Database   | 5432                    | 5432:5432         | TCP      | PostgreSQL Relational Database |

## 4. REST API Specification

### Base URL
`/api`

### Endpoints
- `GET /health`
  - **Description**: Service health check.
  - **Response 200**: `{"status": "ok", "db_connected": true}`

- `GET /api/meetings`
  - **Description**: Retrieve a list of all scheduled meetings.
  - **Response 200**: Array of Meeting objects.

- `POST /api/meetings`
  - **Description**: Schedule a new meeting.
  - **Request Body**:
    ```json
    {
      "title": "Architecture Sync",
      "description": "Weekly alignment on system design",
      "start_time": "2026-09-20T10:00:00Z",
      "end_time": "2026-09-20T11:00:00Z",
      "organizer_email": "slyvkaseveryn@gmail.com"
    }
    ```
  - **Response 201**: Created Meeting object.

- `GET /api/meetings/{id}`
  - **Description**: Fetch single meeting details by ID.
  - **Response 200**: Meeting object.
  - **Response 404**: `{"detail": "Meeting not found"}`

- `DELETE /api/meetings/{id}`
  - **Description**: Cancel and remove a meeting by ID.
  - **Response 204**: No Content.

## 5. Database Schema

### Table: `meetings`
| Column           | Type                     | Constraints                       |
|------------------|--------------------------|-----------------------------------|
| `id`             | UUID / Serial            | Primary Key, Indexed              |
| `title`          | VARCHAR(255)             | NOT NULL                          |
| `description`    | TEXT                     | NULLABLE                          |
| `start_time`     | TIMESTAMP WITH TIME ZONE | NOT NULL                          |
| `end_time`       | TIMESTAMP WITH TIME ZONE | NOT NULL                          |
| `organizer_email`| VARCHAR(255)             | NOT NULL                          |
| `created_at`     | TIMESTAMP WITH TIME ZONE | DEFAULT NOW(), NOT NULL           |

## 6. Migration & Deployment Strategy
1. **Migrations**: Managed strictly via Alembic (`alembic upgrade head`) running automatically on backend container startup or via CI pipeline pre-deploy hook.
2. **Local Workflow**: Single command `docker compose up --build` brings up database, runs migrations, serves API, and runs web UI.
