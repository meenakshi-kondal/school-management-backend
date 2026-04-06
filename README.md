# school-management-backend

This project contains a complete School Management System backend (Node.js/Express with MongoDB). 

## What We Created
1. **Backend API**:
   - A Node.js backend running Express and connected to a MongoDB database.
   - Registration APIs to add students and teachers.
   - Login endpoints for authentication, securely issuing JSON Web Tokens (JWT).
   - Dynamic user schemas using MongoDB discriminators allowing teachers, students, and admins to coexist smoothly.
   - An auto-seeding mechanism to seamlessly create a default admin profile on boot.

## How to Run

### 1. Running the Backend 🛠️

Ensure you have your MongoDB instance running.

1. Navigate to the backend directory:
   ```bash
   cd ../school-backend
   ```
2. Install the necessary dependencies (if you haven't yet):
   ```bash
   npm install
   ```
3. Start the development server (runs on `http://localhost:5000` by default):
   ```bash
   npm run dev
   ```

*(On a successful boot, the system ensures a connection to MongoDB and seeds the default admin account if necessary).*

## Administrator Information 🔐

When the backend spins up and successfully connects to your MongoDB database, it executes an auto-seeder to guarantee an admin profile is available to use immediately.

If there is no admin registered in the system, you can log in to the frontend application using the newly created default credentials:

**Email:** `admin@test.com`  
**Password:** `Admin@11`  
**Role:** `admin`

Simply use these credentials on the login page to gain access to the dashboard. Once authenticated, the system will provide an authorization token to perform other tasks (like admitting students or saving new teacher profiles).
