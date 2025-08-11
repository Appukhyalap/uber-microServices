# User Service

## Overview

The User Service manages user registration, authentication, and profile management for the Uber microservices project. It communicates with other services via synchronous HTTP requests and is integrated into the system through the API Gateway.

## Environment Variables

- `JWT_SECRET`: JWT secret for authentication
- `MONGO_URL`: MongoDB connection string

## Endpoints

| Method | Endpoint     | Description              | Auth   |
|--------|-------------|--------------------------|--------|
| POST   | `/register`  | Register a new user      | None   |
| POST   | `/login`     | Login as user            | None   |
| GET    | `/logout`    | Logout user              | User   |
| GET    | `/profile`   | Get user profile         | User   |

## Request/Response Examples

### Register

**POST** `/register`
```json
{
  "name": "User",
  "email": "user@example.com",
  "password": "password"
}
```
**Response**
```json
{
  "token": "...",
  "newUser": {
    "_id": "...",
    "name": "User",
    "email": "user@example.com"
  }
}
```

### Login

**POST** `/login`
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
**Response**
```json
{
  "token": "...",
  "user": {
    "_id": "...",
    "name": "User",
    "email": "user@example.com"
  }
}
```

### Profile

**GET** `/profile`
**Response**
```json
{
  "_id": "...",
  "name": "User",
  "email": "user@example.com"
}
```

## How It Works

- Synchronous HTTP requests for authentication and profile management.
- JWT-based authentication.
- Integrated with the API Gateway for routing.

## Running the Service

```bash
npm install
node server.js
```

---
