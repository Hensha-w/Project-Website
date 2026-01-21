# Backend Server

## API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/me - Get current user

## Projects
- POST /api/projects - Create new project

- GET /api/projects - Get user's projects

- GET /api/projects/:id - Get specific project

- POST /api/projects/:id/accept - Accept project price

- POST /api/projects/:id/contest - Contest project price

## Payments
- POST /api/payments - Submit payment

- GET /api/payments - Get user's payments

- POST /api/payments/:id/approve - Approve payment (admin)

## Contributing
- Fork the repository

- Create a feature branch (git checkout -b feature/AmazingFeature)

- Commit your changes (git commit -m 'Add some AmazingFeature')

- Push to the branch (git push origin feature/AmazingFeature)

- Open a Pull Request

## Development Guidelines
- Follow the existing code style

- Write meaningful commit messages

- Update documentation when necessary

- Add tests for new features

## License
This project is licensed under the MIT License

