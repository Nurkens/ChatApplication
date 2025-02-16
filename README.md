# Chat Application

Welcome to the Chat Application repository! This project is a simple and intuitive chat application that allows users to communicate in real-time.

## Features

- Real-time messaging
- User authentication and registration
- Private and group chats
- Message notifications
- User profiles
- Emojis and media sharing
- Responsive design

## Technologies Used

- Frontend: React, Redux, HTML, CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Websockets: Socket.io
- Authentication: JWT (JSON Web Tokens)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14.x or later)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chat-application.git
   cd chat-application
   ```

2. Install dependencies for both the frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Contributing

We welcome contributions to the Chat Application project! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.



## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Socket.io](https://socket.io/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Contact

For any inquiries or support, please contact me snkn051114@gmail.com.

Happy chatting!
