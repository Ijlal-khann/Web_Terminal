# Auth Service

Authentication microservice for the Healthcare Appointment System.

## Features

- User registration (doctor/patient roles)
- JWT-based authentication
- HttpOnly cookie sessions
- Password hashing with bcrypt
- MongoDB singleton pattern for Vercel

## Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

## Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:4001`

## Deployment

```bash
vercel --prod
```

Set environment variables in Vercel dashboard.

