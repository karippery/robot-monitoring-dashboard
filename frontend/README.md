# Robot Monitoring Dashboard – Frontend

A modern **real-time robot monitoring dashboard** built with **React + Vite + WebSocket + MUI**, featuring live sensor updates, responsive charts, and a clean industrial UI.

---

## Core Functionality

- **Real-time robot status tracking** via WebSocket
- **Live sensor data** (temperature, vibration, power, efficiency)
- **Robot health cards** with color-coded status (Online, Offline, Maintenance, Error)
- **Click-to-detail navigation** for individual robot deep dive
- **Auto-reconnect** WebSocket with graceful fallback UI
- **Responsive grid layout** (mobile to desktop)

---

## Data Visualization

| Feature                             | Library            |
| ----------------------------------- | ------------------ |
| Interactive line/area charts        | `@mui/x-charts`    |
| Data tables with filtering/sorting  | `@mui/x-data-grid` |
| Custom gauges & progress indicators | `recharts` + MUI   |
| Animated transitions & fade-ins     | CSS + MUI `sx`     |

---

## Technical Features

| Feature                   | Implementation                                      |
| ------------------------- | --------------------------------------------------- |
| **Frontend Framework**    | React 19 + TypeScript                               |
| **Build Tool**            | Vite (fast HMR, ES modules)                         |
| **UI Library**            | MUI v7 (`@mui/material`, `@emotion`)                |
| **State Management**      | React Context + `useRobot()` hook                   |
| **Real-time Updates**     | Native WebSocket (`ws://localhost:8000/ws/robots/`) |
| **HTTP Client**           | `axios` with base config                            |
| **Type Safety**           | Full TypeScript + strict mode                       |
| **Linting & Formatting**  | ESLint + Prettier (via config)                      |
| **Environment Variables** | `.env.local` with `VITE_` prefix                    |

---

## Quick Start

### 1. Prerequisites

- Node.js **v18+**
- npm **v9+**
- Backend API running at `http://localhost:8000`

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd frontend
npm install
```

### 3. Environment Setup

Create `.env.local` in project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws/robots/
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for Production

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

---

## Project Scripts

| Script            | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start dev server with hot reload  |
| `npm run build`   | Type-check + build for production |
| `npm run lint`    | Run ESLint on all files           |
| `npm run preview` | Serve production build locally    |

---

## Folder Structure (Key Parts)

```
src/
├── components/       # Reusable UI (cards, charts, modals)
├── contexts/         # RobotContext (WebSocket + state)
├── services/         # api.ts, websocket.ts
├── theme/            # MUI theme with industrial colors
├── types/            # Robot, RobotData, WebSocketMessage
└── App.tsx           # Main layout + routing
```

---

**Made with React + Vite + MUI + Real-time WebSockets**
