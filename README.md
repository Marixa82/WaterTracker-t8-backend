# WaterTracker-t8-backend

The Water Tracker app provides basic functionality for a web application that allows you to track and manage your water consumption on a daily basis.

## Table of Contents

- [Frontend](#frontend)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)

## Basic capabilities

- Creating user accounts
- Entering the daily rate of water consumption
- Calculation of the amount of water drunk in percent
- Calculation of the amount of water consumed per day and month
- Entering the amount of water consumed for a certain day and time
- Deleting incorrectly entered data

# Frontend

- [GitHub](https://github.com/Stee1Lemon/water-tracker)
- [LivePage](https://stee1lemon.github.io/water-tracker/welcome)

# Features

The Water Tracker backend provides a set of functions that allow users to interact with the system through API endpoints (# Usage)

# Getting Started

# Prerequisites

Before you can run the Water Tracker backend, you'll need to have the following software installed on your system:

- Node.js - JavaScript runtime
- npm or Yarn - Package manager for Node.js

# Installation

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/marixa82/WaterTracker-t8-backend
   ```
2. Change your current directory to the project folder:
   ```
   cd WaterTracker-t8-backend
   ```
3. Install the project dependencies:
   ```
   npm install
   or
   yarn install
   ```
4. Configure the environment variables. You will need to create a .env file in the project root and define the required variables (e.g., database connection details, API keys, etc) - see `.env.example` for required variables.
5. Start the server:
   ```
   npm run start:dev
   or
   yarn run start:dev
   ```
   Your Water Tracker backend should now be running and accessible at `http://localhost:3000` (if you set the PORT `.env` variable as 3000).

# Usage

Here are some example use cases of the Water Tracker backend:

- To create a new user account, send a POST request to `/api/auth/register`.
- To verify a user's email, send a GET request to `/api/auth/verify/:verificationCode`.
- To request a user's email verification, send a POST request to `/api/auth/verify`.
- To authenticate a user, send a POST request to `/api/auth/login`.
- To logout a user, send a POST request to `/api/auth/logout`.
- To forgot-password a user, send a POST request to `/api/auth/forgot-password`.
- To update a user's avatar, send a PATCH request to `/api/user/avatars`.
- To get a user's current profile, send a GET request to `/api/user/current`.
- To update a user's current profile, send a PUT request to `/api/user/current`.
- To check a user's password before delete user account, send a POST request to `/api/user/checkPassword`.
- To delete a user's account, send a DELETE request to `/api/user`.
- To update user's water rate, send a PATCH request to `/api/waters/water_rate`.
- To add a record of consumed water, send a POST request to `/api/waters`.
- To edit of the record of consumed water, send a PUT request to `/api/waters/:id`.
- To delete a record of consumed water, send a DELETE request to `/api/waters/:id`.
- To obtain information about the amount of water consumed for the selected month, send a GET request to `/api/waters/per_month`.
- To calculate in percentage of the amount of water consumed and a list of all records of water consumption by the user for the current day, send a GET request to `/api/waters/today`.

These endpoints allow you to interact with various features on the Water Tracker backend.

# API Documentation

For detailed API documentation or tests, please refer to the [Swagger API Documentation](https://watertracker-t8-backend.onrender.com/api-docs/#/). The first opening may be long, because free render.com service is used for backend deployment.

# Contributors

- Maryna Aksakova - Team Lead / Developer
  - [GitHub](https://github.com/Marixa82)
  - [LinkedIn](https://www.linkedin.com/in/maryna-aksakova-3a0b9623b/)
- AlinaTantsura - Developer
  - [GitHub](https://github.com/AlinaTantsura)
  - [LinkedIn](https://www.linkedin.com/in/alina-tantsura/)
- Maksym Visotsky - Developer

  - [GitHub](https://github.com/Needlife1)
  - [LinkedIn](https://www.linkedin.com/in/maxim-vysotsky-74a570274/)

  **A big thank you to our team for their contributions to this project!**
