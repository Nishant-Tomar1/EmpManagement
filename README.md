# Employee Management Platform

This repository contains a web-based platform designed for employee assessment and management.

## Features

- **Employee Assessment**: Evaluate employee performance through various metrics.
- **Data Management**: Store and manage employee information securely.
- **User Authentication**: Secure login and registration system.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Nishant-Tomar1/EmpManagement.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd EmpManagement
   ```

3. **Install dependencies for the server**:

   ```bash
   cd server
   npm install
   ```

4. **Install dependencies for the client**:

   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=8000
MONGODB_URI=your_mongodb_uri
CORS_ORIGIN=http://localhost:3000
TOKEN_SECRET=your_token_secret
TOKEN_EXPIRY=3d
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_MAIL=your_smtp_email
SMTP_PASS=your_smtp_password
```

### Running the Application

1. **Start the server**:

   ```bash
   cd server
   npm start
   ```

2. **Start the client**:

   ```bash
   cd ../client
   npm start
   ```

The application should now be running, with the frontend accessible at `http://localhost:3000` and the backend at `http://localhost:8000`.

## API Documentation

Detailed API documentation is available through Postman:

[EmpManagement API Documentation](https://documenter.getpostman.com/view/30488668/2sAYHxmiXK)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact :

- **Linked In**: [Nishant Tomar](https://www.linkedin.com/in/nishant-tomar-7694aa2aa/)
- **Instagram**: [@myself_nishant](https://www.instagram.com/myself_nishant)
