# Ride Service

## Overview

The Ride Service manages ride creation and acceptance for the Uber microservices project. It communicates asynchronously with other services using RabbitMQ.

## Environment Variables

- `JWT_SECRET`: JWT secret for authentication
- `MONGO_URL`: MongoDB connection string
- `BASE_URL`: Base URL for user service
- `RABBIT_URL`: RabbitMQ connection string

## Endpoints

| Method | Endpoint         | Description                | Auth         |
|--------|------------------|----------------------------|--------------|
| GET    | `/`              | Health check               | None         |
| POST   | `/create-ride`   | Create a new ride          | User         |
| PUT    | `/accept-ride`   | Accept a ride (by captain) | Captain      |

## Request/Response Examples

### Create Ride

**POST** `/create-ride`
```json
{
  "pickup": "Location A",
  "destination": "Location B"
}
```
**Response**
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

### Accept Ride

**PUT** `/accept-ride?rideId=<ride_id>`
**Response**
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

## RabbitMQ Integration

- Publishes to `new-ride` queue when a ride is created.
- Publishes to `ride-accepted` queue when a ride is accepted.

## How It Works

- Synchronous HTTP requests for user/captain authentication.
- Asynchronous messaging via RabbitMQ for ride events.

## Running the Service

```bash
npm install
node server.js
```
