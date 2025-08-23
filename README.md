# Task-Manager

## Description

A full-stack task management application that allows users to create, read, update, and delete their tasks. The application includes robust user authentication powered by JSON Web Tokens (JWT) to ensure that users can securely manage their own tasks.

## Features

* **User Authentication:** Secure user sign-up, login, and logout functionality.
* **Task Management (CRUD):**
    * **Create:** Add new tasks with details like title and description.
    * **Read:** View all your tasks.
    * **Update:** Edit existing tasks.
    * **Delete:** Remove tasks when they are no longer needed.
* **JWT-based Authorization:** Ensures that only authenticated users can access and modify their tasks.

## Technologies Used

* **JavaScript:** The primary programming language.
* **Node.js:** The back-end runtime environment.
* **npm:** For package management.
* **JSON Web Tokens (JWT):** For secure user authentication.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

* **Node.js** (LTS version recommended)
* **npm** (comes with Node.js)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/Raghavendra-sb/Task-Manager.git](https://github.com/Raghavendra-sb/Task-Manager.git)
cd Task-Manager

### 2. Install Dependencies
Install the necessary Node.js packages.

npm install


Set Up Environment Variables
Create a .env file in the root of the project to store your environment variables, such as your database connection string and JWT secret key.

# .env file
JWT_SECRET=your_jwt_secret_key
MONGO_URI=your_mongodb_connection_string

4. Run the Application
Start the development server.

Bash

npm start
The application should now be running locally. You can access the API endpoints (if this is a backend-only project) or the front-end interface (if it's a full-stack project).

License
This project is licensed under the MIT License - see the LICENSE file for details.

Author
Raghavendra-sb - GitHub Profile
