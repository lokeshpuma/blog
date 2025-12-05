# Deployment Guide

This guide explains how to configure environment variables for deploying the blog application.

## Backend Configuration

### 1. Environment Variables (.env)

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=3000

# Frontend URL (for CORS) - Update this with your frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret Key - CHANGE THIS IN PRODUCTION!
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# JWT Expiration Time
JWT_EXPIRES_IN=7d
```

### 2. Production Backend .env Example

For production deployment, update your `.env` file:

```env
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-actual-production-secret-key-min-32-characters-long
JWT_EXPIRES_IN=7d
```

### 3. Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your production values

3. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Frontend Configuration

### 1. Environment Variables (.env)

Create a `.env` file in the `frontend/` directory with the following variables:

```env
# Backend API URL - Update this with your backend URL
VITE_API_URL=http://localhost:3000/api

# Backend Auth API URL
VITE_AUTH_API_URL=http://localhost:3000/api/auth
```

### 2. Production Frontend .env Example

For production deployment, update your `.env` file:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_AUTH_API_URL=https://your-backend-domain.com/api/auth
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

### 3. Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your production backend URL

3. Build for production:
   ```bash
   npm run build
   ```

4. The `dist/` folder contains the production build that can be deployed to any static hosting service.

## CORS Configuration

The backend is configured to accept requests from the frontend URL specified in `FRONTEND_URL`. Make sure:

1. **Backend `.env`** has the correct `FRONTEND_URL` pointing to your frontend domain
2. **Frontend `.env`** has the correct `VITE_API_URL` pointing to your backend domain

## Security Notes

1. **Never commit `.env` files to version control** - They are already in `.gitignore`
2. **Use strong JWT secrets** - Generate a random string at least 32 characters long
3. **Use HTTPS in production** - Always use HTTPS URLs in production `.env` files
4. **Rotate secrets regularly** - Change your JWT_SECRET periodically

## Environment Variable Reference

### Backend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | Yes (for CORS) |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` | No |

### Frontend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` | Yes |
| `VITE_AUTH_API_URL` | Backend Auth API URL | `http://localhost:3000/api/auth` | Yes |

## Deployment Checklist

- [ ] Backend `.env` file created with production values
- [ ] Frontend `.env` file created with production backend URL
- [ ] JWT_SECRET changed from default value
- [ ] FRONTEND_URL updated to production frontend domain
- [ ] VITE_API_URL updated to production backend domain
- [ ] HTTPS URLs used in production
- [ ] `.env` files are in `.gitignore` (already configured)
- [ ] Backend server is running and accessible
- [ ] Frontend build completed successfully
- [ ] CORS is working correctly

## Testing the Configuration

1. **Backend Test:**
   ```bash
   cd backend
   npm start
   # Should see: "Server started on http://localhost:3000"
   # Should see: "CORS enabled for: [your-frontend-url]"
   ```

2. **Frontend Test:**
   ```bash
   cd frontend
   npm run dev
   # Open browser and check if API calls work
   ```

## Common Issues

### CORS Errors
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend domain exactly
- Include protocol (http:// or https://) in the URL
- No trailing slash in the URL

### API Connection Errors
- Verify `VITE_API_URL` in frontend `.env` is correct
- Check if backend server is running
- Verify network/firewall settings

### JWT Token Errors
- Ensure `JWT_SECRET` is set in backend `.env`
- Make sure the secret is the same across all backend instances (if using multiple servers)

