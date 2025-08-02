# Captain Service

## Overview

The Captain Service manages captain registration, authentication, availability, and ride assignment. It uses RabbitMQ for asynchronous ride notifications.

## Environment Variables

- `JWT_SECRET`: JWT secret for authentication
- `MONGO_URL`: MongoDB connection string
- `RABBIT_URL`: RabbitMQ connection string

## Endpoints

| Method | Endpoint                | Description                  | Auth     |
|--------|-------------------------|------------------------------|----------|
| POST   | `/register`             | Register a new captain       | None     |
| POST   | `/login`                | Login as captain             | None     |
| GET    | `/logout`               | Logout and blacklist token   | Captain  |
| GET    | `/profile`              | Get captain profile          | Captain  |
| PATCH  | `/toggle-Availability`  | Toggle captain availability  | Captain  |
| GET    | `/new-ride`             | Wait for new ride assignment | Captain  |

## Request/Response Examples

### Register

**POST** `/register`
```json
{
  "name": "Captain",
  "email": "captain@example.com",
  "password": "password"
}
```
**Response**
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

### Wait for New Ride

**GET** `/new-ride`
- Long-polling endpoint. Responds with new ride data when available.

**Response**
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

## RabbitMQ Integration

- Subscribes to `new-ride` queue to receive new ride requests.

## How It Works

- Synchronous HTTP requests for authentication.
- Asynchronous ride notifications via RabbitMQ.

## Running the Service

```bash
npm install
node server.js
```
