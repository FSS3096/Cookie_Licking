# Cookie-Licking Detector

A full-stack web application to detect and manage "cookie licking" in open source projects - when contributors claim issues but fail to deliver.

## Features

- User authentication with email/password and GitHub OAuth
- Issue claim management system
- Automated detection of inactive claims
- Notification system for nudging contributors
- Role-based access control (contributors and maintainers)
- Responsive and modern UI

## Tech Stack

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for GitHub OAuth
- Node-cron for automated tasks

### Frontend

- React with TypeScript
- React Router for navigation
- Axios for API calls
- React Context for state management
- Modern CSS for styling

## Getting Started

### Prerequisites

- For Development:
  - Node.js (v14 or higher)
  - MongoDB
  - GitHub OAuth Application credentials
- For Production:
  - Docker
  - Docker Compose

### Development Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/cookie-licking-detector.git
   cd cookie-licking-detector
   \`\`\`

2. Install backend dependencies:
   \`\`\`bash
   cd backend
   npm install
   cp .env.sample .env

# Update .env with your configuration

\`\`\`

3. Install frontend dependencies:
   \`\`\`bash
   cd ../frontend
   npm install
   \`\`\`

4. Start the development servers:

Backend:
\`\`\`bash
cd backend
npm run dev
\`\`\`

Frontend:
\`\`\`bash
cd frontend
npm start
\`\`\`

### Production Deployment

1. Configure production environment:
   \`\`\`bash
   cp .env.production.sample .env.production

# Update .env.production with your production configuration

\`\`\`

2. Deploy using Docker Compose:
   \`\`\`bash
   chmod +x deploy.sh
   ./deploy.sh
   \`\`\`

The deployment script will:

- Load environment variables
- Build and start Docker containers
- Check service health

3. Access the application:

- Frontend: http://your-domain.com
- API: http://your-domain.com/api

### Monitoring

Check service health:
\`\`\`bash
docker-compose ps
\`\`\`

View logs:
\`\`\`bash

# All services

docker-compose logs -f

# Specific service

docker-compose logs -f [service_name]
\`\`\`

## Environment Variables

### Backend (.env)

- PORT: Server port (default: 5000)
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret key for JWT tokens
- GITHUB_CLIENT_ID: GitHub OAuth app client ID
- GITHUB_CLIENT_SECRET: GitHub OAuth app client secret
- FRONTEND_URL: Frontend application URL for CORS

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
