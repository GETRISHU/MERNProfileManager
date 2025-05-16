
# Profile Wizard Backend API

Backend API for the Profile Wizard multi-step form application.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/profile-wizard
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

3. Start the server:
```
npm run dev
```

4. Seed the database with initial location data:
```
npm run seed
```

## API Endpoints

### User Management

- **POST /api/users/register** - Register a new user
- **POST /api/users/check-username** - Check username availability
- **GET /api/users/:id** - Get user by ID (requires authentication)
- **PUT /api/users/:id** - Update user profile (requires authentication)

### Location Data

- **GET /api/users/locations/countries** - Get all countries
- **GET /api/users/locations/countries/:countryId/states** - Get states by country
- **GET /api/users/locations/countries/:countryId/states/:stateId/cities** - Get cities by state
- **POST /api/users/locations/seed** - Seed location data

## File Upload

The API supports profile picture uploads with the following constraints:
- Maximum file size: 2MB
- Allowed formats: JPEG, PNG

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected routes, include the token in the request header:

```
Authorization: Bearer YOUR_TOKEN
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400** - Bad Request (validation error, etc.)
- **401** - Unauthorized (missing or invalid token)
- **404** - Not Found (resource not found)
- **500** - Internal Server Error
