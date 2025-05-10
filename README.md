# Login Microservice

Login-Service is a Node.js microservice responsible for managing user authentication and information in a distributed application architecture. It provides RESTful APIs for creating, retrieving, updating, and deleting user data. Additionally, it facilitates authentication and authorization mechanisms and interacts with other services (e.g., order-service, payment-service, notification-service) via HTTP and RabbitMQ for inter-service communication. The service uses MongoDB Atlas for cloud-based database management.

### Communication Flow Between Services

1. User Creation

Client sends a request to login-service.

login-service validates input, encrypts the password, and stores user data in MongoDB Atlas.

login-service publishes a notification message to RabbitMQ to inform other services (e.g., notification-service).

2. User Authentication

Client sends login credentials to login-service.

login-service validates credentials and generates a JWT token.

JWT token is used by other services (e.g., order-service) to validate user requests.

3. Payment Processing

order-service requests payment-service to process a transaction.

payment-service validates payment details, processes the transaction, and publishes a success/failure message to RabbitMQ.

order-service updates the order status based on the payment outcome.

4. Notification Processing

login-service and payment-service publish user-related notification messages to RabbitMQ.

notification-service consumes these messages and initiates necessary email communication.

### Tech Stack Used

Back End: Node.js + Express

Database: MongoDB (Atlas)

Message Broker: RabbitMQ

Containerization: Docker + Docker Desktop

### API Endpoints

POST /signup: Register new user

POST /login: Authenticate user

### Database Design

User Collection (MongoDB Atlas):

name: String

password: String
