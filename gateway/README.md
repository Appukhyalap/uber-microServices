# Gateway Service

## Overview

The Gateway Service acts as an API gateway, routing requests to the user, captain, and ride services. It enables both synchronous (HTTP) and asynchronous (RabbitMQ) communication between services.

## Routes

| Path        | Forwards to                |
|-------------|---------------------------|
| `/user`     | http://localhost:3001      |
| `/captain`  | http://localhost:3002      |
| `/ride`     | http://localhost:3003      |

## How It Works

- Receives HTTP requests and proxies them to the appropriate microservice.
- Enables synchronous communication between clients and services.
- Asynchronous communication (e.g., ride notifications) is handled by RabbitMQ between services.

## Running the Service

```bash
npm install
node app.js
```

## Example

To create a ride:
```
POST http://localhost:3000/ride/create-ride
```
To listen for new rides as a captain:
```
GET http://localhost:3000/captain/new-ride
```
