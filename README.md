# FuelEU Maritime Compliance Platform

This project is a 24-hour full-stack assignment to implement key parts of a FuelEU Maritime compliance platform. It includes a backend API for managing routes, compliance, and pooling, and a frontend dashboard for interacting with the data.

## 🚀 Tech Stack

* **Backend:** Node.js, Express, TypeScript, PostgreSQL (via Supabase), Prisma
* **Frontend:** React, Vite, TypeScript, TailwindCSS v4
* **Testing:** Jest, Supertest
* **Architecture:** Hexagonal (Ports & Adapters)

---

## 🏛️ Architecture

The project follows a strict Hexagonal (Ports & Adapters) architecture in both the frontend and backend.

### Backend (`/backend`)

* **`src/core`:** Contains pure, framework-agnostic business logic.
    * **`domain`:** Entities (`Route.ts`) and Domain Services (`PoolService.ts`).
    * **`application`:** Use cases that orchestrate the logic (`CreatePoolUseCase.ts`).
    * **`ports`:** Interfaces (`IRouteRepository.ts`) that decouple the core from outside tools.
* **`src/adapters`:** Contains framework-specific "glue" code.
    * **`inbound/http`:** Express controllers that handle HTTP requests.
    * **`outbound/postgres`:** Prisma implementations of the repository ports.
* **`src/infrastructure`:** Holds the DB (Prisma schema) and server (Express) setup.

### Frontend (`/frontend`)

* **`src/core`:** Pure, React-agnostic logic.
    * **`domain`:** TypeScript types (`types.ts`).
    * **`ports`:** The API interface (`IApiPort.ts`).
* **`src/adapters`:** React and framework-specific code.
    * **`infrastructure`:** The `AxiosApi.ts` client that implements the `IApiPort`.
    * **`ui`:** All React components, separated into:
        * `components`: Reusable, dumb components (`Button.tsx`, `InputField.tsx`).
        * `hooks`: Stateful "application" logic (`useBanking.ts`, `usePooling.ts`).
        * `tabs`: The four main page components (`BankingTab.tsx`, `RoutesTab.tsx`).

---

## 🛠️ Setup & Run

### Backend

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your Supabase `DATABASE_URL` and `DIRECT_URL`.
    ```ini
    DATABASE_URL="postgresql://..."
    DIRECT_URL="postgresql://..."
    ```
4.  Run the database migrations:
    ```bash
    npx prisma migrate dev
    ```
5.  Seed the database with initial routes:
    ```bash
    npm run seed
    ```
6.  Start the development server:
    ```bash
    npm run dev
    ```
    The backend will be running at `http://localhost:3001`.

### Frontend

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and point it to your backend:
    ```ini
    VITE_API_BASE_URL=http://localhost:3001/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

---

## 🧪 Testing

The backend includes a suite of unit and integration tests.

1.  From the `/backend` folder:
2.  Run all tests:
    ```bash
    npm run test
    ```
3.  Run a specific test file:
    ```bash
    npm run test -- src/adapters/inbound/http/Endpoints.integration.test.ts
    ```

---

## 📸 Screenshots

### Routes Tab
![Routes Tab](./screenshots/Screenshot%202025-11-07%20at%209.53.50 PM.png)

### Compare Tab
![Compare Tab 1](./screenshots/Screenshot%202025-11-07%20at%209.54.11 PM.png)
![Compare Tab 2](./screenshots/Screenshot%202025-11-07%20at%209.54.15 PM.png)

### Banking Tab
![Banking Tab 1](./screenshots/Screenshot%202025-11-07%20at%209.54.29 PM.png)
![Banking Tab 2](./screenshots/Screenshot%202025-11-07%20at%209.54.43 PM.png)

### Pooling Tab
![Pooling Tab](./screenshots/Screenshot%202025-11-07%20at%209.54.55 PM.png)