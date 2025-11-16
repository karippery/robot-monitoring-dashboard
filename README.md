# FactoryWatch – Industrial Robot Monitoring Dashboard

**FactoryWatch – Real-time industrial robot monitoring dashboard.**
**Frontend:** React 19 + TypeScript, Vite, MUI v7, WebSocket live updates, responsive charts.
**Backend:** Django 5.2, DRF, Channels, Celery, Redis, PostgreSQL — fake data simulation, REST API, Docker + Poetry.

[![Django 5.2](https://img.shields.io/badge/Django-5.2-092E20?logo=django)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.16-blue)](https://www.django-rest-framework.org/)
[![Channels](https://img.shields.io/badge/Channels-4.3-orange)](https://channels.readthedocs.io/)
[![Celery](https://img.shields.io/badge/Celery-5.5-red)](https://docs.celeryq.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![Poetry](https://img.shields.io/badge/Poetry-1.8-60A5FA?logo=poetry)](https://python-poetry.org/)

**Real-time factory robot monitoring system** with **fake data simulation**, **WebSocket live updates**, **REST API**, and **Docker + Poetry** setup — built with **Django 5.2**, **DRF**, **Channels**, **Celery**, **Redis**, and **PostgreSQL**.

---

## Features

| Feature                  | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| **Live Robot Dashboard** | Real-time updates via WebSocket (`ws://localhost:8000/ws/robots/`) |
| **Fake Data Simulation** | Realistic sensor data every **3 seconds**                          |
| **Smart Status Logic**   | Online → Error → Maintenance → Offline transitions                 |
| **REST API + OpenAPI**   | Full CRUD + `drf-spectacular` schema                               |
| **Background Tasks**     | Celery + Redis for non-blocking simulation                         |
| **Dockerized Stack**     | Web, DB, Redis, Celery Worker & Beat                               |
| **Poetry**               | Clean, reproducible, linted code                                   |

---

## Tech Stack

| Layer               | Technology                                  |
| ------------------- | ------------------------------------------- |
| **Framework**       | Django 5.2                                  |
| **API**             | Django REST Framework + `drf-spectacular`   |
| **Real-time**       | Django Channels + Redis Channel Layer       |
| **Tasks**           | Celery 5.5 + Redis                          |
| **Database**        | PostgreSQL                                  |
| **Container**       | Docker + Docker Compose                     |
| **Package Manager** | [Poetry](https://python-poetry.org/)        |
| **Static Files**    | WhiteNoise                                  |
| **Dev Tools**       | `django-debug-toolbar`, `django-extensions` |
| **CORS**            | `django-cors-headers`                       |

---

## Quick Start (Docker)

### 1. Clone & Enter

```bash
git clone https://github.com/yourusername/FactoryWatch.git
cd FactoryWatch
```

### 2. Create `.env` (copy from example)

```bash
cp .env.example .env
```

Edit `.env` with your values (or use defaults for dev).

### 3. Start with Docker

```bash
docker-compose up --build
```

> Wait for: `PostgreSQL started`, `Running migrations...`, `Seeding initial robots...`

### 4. Access

| Service        | URL                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------- |
| **API**        | [http://localhost:8000/api/](http://localhost:8000/api/)                                     |
| **OpenAPI UI** | [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/) |
| **WebSocket**  | `ws://localhost:8000/ws/robots/`                                                             |
| **Admin**      | [http://localhost:8000/admin](http://localhost:8000/admin)                                   |

---

## API Endpoints

```http
GET    /api/robots/                → List robots + latest sensor
GET    /api/robots/<id>/           → Robot detail
GET    /api/robots/<id>/history/   → Time-series data
GET    /api/robot-data/            → ALL robot data records across all robots.
GET    /api/robot-data/<id>/       → Gets a specific individual data record by its ID.
```

OpenAPI docs: [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)

---

## WebSocket Live Updates

Connect to `ws://localhost:8000/ws/robots/`:

```json
{
  "type": "initial_data",
  "robots": [
    /* full list with latest_data */
  ]
}
```

Every **2 seconds**:

```json
{
  "type": "robot_update",
  "update_type": "robot_status",
  "robots": [
    /* updated */
  ],
  "timestamp": "2025-11-16T17:58:00Z"
}
```

---

## Local Development (Poetry)

```bash
# Install Poetry (if not installed)
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Activate shell
poetry shell

# Run migrations
python manage.py migrate

# Seed robots
python manage.py shell -c "from robots.tasks import create_initial_robots; create_initial_robots()"

# Start server
python manage.py runserver

# Start Celery worker
celery -A config worker -l info

# Start Celery Beat
celery -A config beat -l info
```

---

## Environment Variables (`.env`)

```env
SECRET_KEY=your-super-secret-key
DEBUG=True

DB_NAME=factory_db
DB_USER=factory_user
DB_PASSWORD=factory_pass
DB_HOST=db
DB_PORT=5432

REDIS_HOST=redis
REDIS_PORT=6379
```

---

## Create Superuser

```bash
docker-compose exec web python manage.py createsuperuser
```

or locally:

```bash
poetry run python manage.py createsuperuser
```

---

## Development Tools

- **Formatting**: `black`, `isort`
- **Linting**: `flake8`
- **Testing**: `pytest`, `pytest-django`, `factory-boy`

---

## Contributing

1. Fork the repo
2. Create branch: `git checkout -b feature/cool-thing`
3. Commit: `git commit -m 'Add cool thing'`
4. Push: `git push origin feature/cool-thing`
5. Open Pull Request
