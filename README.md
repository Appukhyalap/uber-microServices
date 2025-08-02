# Uber Microservices Project

This project is a microservices-based backend for an Uber-like platform, consisting of the following services:

- **User Service** (not shown in code above)
- **Captain Service**
- **Ride Service**
- **Gateway Service**
- **RabbitMQ** for asynchronous communication

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [RabbitMQ Integration](#rabbitmq-integration)
- [Gateway Service](#gateway-service)
- [Ride Service](#ride-service)
- [Captain Service](#captain-service)
- [User Service](#user-service)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)

---

## Architecture Overview

- **Gateway Service**: Routes HTTP requests to the appropriate microservice.
- **Ride Service**: Handles ride creation and acceptance.
- **Captain Service**: Handles captain registration, authentication, and ride assignment.
- **User Service**: Handles user registration and authentication (not shown).
- **RabbitMQ**: Used for asynchronous communication (e.g., notifying captains of new rides).

---

## RabbitMQ Integration

- **Queues Used**:
  - `new-ride`: Published by Ride Service when a new ride is created. Subscribed by Captain Service.
  - `ride-accepted`: Published by Ride Service when a ride is accepted.

- **How It Works**:
  - When a user creates a ride, Ride Service publishes the ride data to `new-ride`.
  - Captain Service listens to `new-ride` and notifies available captains.
  - When a captain accepts a ride, Ride Service publishes to `ride-accepted`.

---

## Gateway Service

**Location:** `gateway/`

**Role:**  
Acts as an API gateway, forwarding requests to the appropriate service.

**Routes:**

| Path        | Forwards to                |
|-------------|---------------------------|
| `/user`     | http://localhost:3001      |
| `/captain`  | http://localhost:3002      |
| `/ride`     | http://localhost:3003      |

**Run:**
```bash
cd gateway
npm install
node app.js
```

---

## Ride Service

**Location:** `ride/`

**Role:**  
Handles ride creation and acceptance.

**Endpoints:**

| Method | Endpoint         | Description                | Auth         |
|--------|------------------|----------------------------|--------------|
| GET    | `/`              | Health check               | None         |
| POST   | `/create-ride`   | Create a new ride          | User         |
| PUT    | `/accept-ride`   | Accept a ride (by captain) | Captain      |

**Request/Response Examples:**

- **Create Ride**
  - Request:
    ```json
    {
      "pickup": "Location A",
      "destination": "Location B"
    }
    ```
  - Response:
    ```json
    {
      "_id": "...",
      "user": "...",
      "pickup": "Location A",
      "destination": "Location B",
      "status": "requested",
      "createdAt": "...",
      "updatedAt": "..."
    }
    ```

- **Accept Ride**
  - Request: `PUT /accept-ride?rideId=<ride_id>`
  - Response:
    ```json
    {
      "_id": "...",
      "user": "...",
      "pickup": "...",
      "destination": "...",
      "status": "accepted",
      "createdAt": "...",
      "updatedAt": "..."
    }
    ```

**RabbitMQ:**
- Publishes to `new-ride` and `ride-accepted` queues.

**Run:**
```bash
cd ride
npm install
node server.js
```

---

## Captain Service

**Location:** `captain/`

**Role:**  
Handles captain registration, authentication, availability, and ride assignment.

**Endpoints:**

| Method | Endpoint                | Description                  | Auth     |
|--------|-------------------------|------------------------------|----------|
| POST   | `/register`             | Register a new captain       | None     |
| POST   | `/login`                | Login as captain             | None     |
| GET    | `/logout`               | Logout and blacklist token   | Captain  |
| GET    | `/profile`              | Get captain profile          | Captain  |
| PATCH  | `/toggle-Availability`  | Toggle captain availability  | Captain  |
| GET    | `/new-ride`             | Wait for new ride assignment | Captain  |

**Request/Response Examples:**

- **Register**
  - Request:
    ```json
    {
      "name": "Captain",
      "email": "captain@example.com",
      "password": "password"
    }
    ```
  - Response:
    ```json
    {
      "token": "...",
      "newcaptain": {
        "_id": "...",
        "name": "Captain",
        "email": "captain@example.com",
        "isAvailable": false
      }
    }
    ```

- **Wait for New Ride**
  - Request: `GET /new-ride`
  - Response:
    ```json
    {
      "data": {
        "_id": "...",
        "pickup": "...",
        "destination": "...",
        "status": "requested"
      }
    }
    ```

**RabbitMQ:**
- Subscribes to `new-ride` queue.

**Run:**
```bash
cd captain
npm install
node server.js
```

---

## User Service

**Location:** `user/` (not shown in code above)

**Role:**  
Handles user registration, authentication, and profile management.

**Endpoints:**  
Typical endpoints include `/register`, `/login`, `/profile`, etc.

---

## Running the Project

1. **Start RabbitMQ** (use CloudAMQP or local instance).
2. **Start each service**:
   - `cd user && npm install && node server.js`
   - `cd captain && npm install && node server.js`
   - `cd ride && npm install && node server.js`
   - `cd gateway && npm install && node app.js`
3. **Access via Gateway** at `http://localhost:3000`.

---

## Environment Variables

Each service uses a `.env` file. Example variables:

```
JWT_SECRET=your_jwt_secret
MONGO_URL=mongodb://localhost/service-db
BASE_URL=http://localhost:3000
RABBIT_URL=amqps://username:password@rabbitmq-host/vhost
```

---

## Notes

- All authentication is JWT-based.
- RabbitMQ is used for asynchronous communication between services.
- Gateway enables synchronous HTTP routing.
- Each service is independently deployable and scalable.

---
