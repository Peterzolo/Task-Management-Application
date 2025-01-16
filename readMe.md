# **Task Management Application**

A task management application built with **Node.js**, **TypeScript**, **PostgreSQL**, and **Sequelize**. This app allows users to manage tasks, create projects, and assign tasks to team members. It provides a simple API for managing tasks and projects with full CRUD functionality.

## **Table of Contents**

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)
- [License](#license)

---

## **API Documentation**

For detailed API documentation, including all available endpoints, request parameters, and responses, refer to the Postman API documentation: [Task Management API Documentation](https://documenter.getpostman.com/view/10754987/2sAYQZHs1H)

---

## **Features**

- **Task Creation**: Create tasks with titles, descriptions, and due dates.
- **Task Assignment**: Assign tasks to users.
- **Project Management**: Create, update, and delete projects.
- **Task Status**: Track the status of tasks (Pending, In Progress, Completed).
- **User Management**: Manage users and assign them to projects.
- **API Endpoints**: RESTful API for interacting with tasks and projects.

---

## **Technologies**

- **Node.js**: JavaScript runtime for the backend server.
- **TypeScript**: Typed superset of JavaScript for better maintainability and development experience.
- **Express**: Web framework for building the REST API.
- **PostgreSQL**: Relational database for storing tasks, projects, and users.
- **Sequelize**: ORM (Object-Relational Mapping) for interacting with the PostgreSQL database.
- **Docker**: Containerization for easy setup and deployment.

---

## **Installation**

### **Prerequisites**

Before setting up the application, ensure that the following tools are installed:

- **Node.js** (v20)
- **npm** (Node Package Manager)
- **PostgreSQL** (for local database setup) or a cloud-based database.
- **Docker** (optional, for containerization)

### **Steps to Install**

1. **Clone the Repository**:
   First, clone the repository to your local machine:

   ```bash
   git clone git@github.com:Peterzolo/Task-Management-Application.git
   cd task-management-app
