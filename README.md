# RBAC-Review-System
- This project is an enhanced full-stack user review system that includes password hashing, JWT tokens for authentication, role-based user management (admins, moderators, and users), and regex validation across all inputs. The system allows authenticated users to submit, edit, and delete reviews for various products. Admins have additional privileges to manage inappropriate content, and moderators can delete inappropriate comments but do not have access to the admin dashboard.

## Features
**User Authentication:**

- Users must log in to submit, edit, or delete reviews.
- Passwords are securely hashed using bcrypt for safe authentication.
- JWT tokens are used for secure authentication and role-based authorization.

**Role-based User System:**

- Users can only submit, edit their own reviews.
- Admins can manage all reviews and have access to the admin dashboard.
- Moderators can delete inappropriate reviews but do not have access to the admin dashboard.
- Review Submission: Users can submit reviews with a rating (1-5 stars) and a comment for each product.

**Review Editing and Deletion:**

- Users can update or delete their own reviews.
- Admins and Moderators can delete inappropriate reviews.

**Regex Validation:**

- Input fields such as email, password, rating, and comment are validated using regular expressions to ensure correct formatting and data integrity.
- Ratings must be within the 1-5 range, and comments must meet length requirements.
- Admin Dashboard: Only accessible to admins, this dashboard provides an overview of reviews and allows them to manage inappropriate reviews.

**Inappropriate Content Management:** Admins and moderators can delete reviews that violate content policies.

**Frontend Notifications:** Using react-toastify, users are notified of successful actions (e.g., submission, editing) and errors (e.g., validation errors, failed requests).

## Technologies Used
- Frontend: React, React Router, Axios, React Icons, CSS, react-toastify
- Backend: Node.js, Express.js, bcrypt (for password hashing), JWT (for authentication and authorization)
- Database: MySQL (for storing items, bookmarks, and user data)
- Styling: Custom CSS, react-toastify for notifications
## Prerequisites
Before you begin, ensure you have the following installed:

- Node.js (v14+)
- npm or yarn
- MySQL or any other DBMS software (if running the backend locally)
- Setup and Installation
## Clone the repository

```bash
git clone https://github.com/yourusername/User-Review-Functionality.git
cd User-Review-Functionality
```
## Install dependencies on the frontend and backend

```bash
Copy code
npm install
```
## Configure Environment Variables

- Create a .env file in the root directory and add your environment variables for the DBMS server credentials and JWT secret key.

- Create a database and run the queries in the provided SQL file:

Database setup SQL

## Run the Application on the Frontend and Backend

### Frontend:

```bash
npm run dev
```
### Start the Backend Server
```
bash
Copy code
npm start
or
bash
Copy code
nodemon index.js
```

## Screenshots
- User Login


- Products Listing


- Search Filter


- View Product Reviews


- Submit a Review


- User Can View Their Reviews


- Edit a Review


## Admin Login and Review Viewing


## Admin or Moderator Deleting an Inappropriate Review



View the API Documentation: Postman API Documentation
License
This project is licensed under the MIT License.

- Contact
-- For questions, please contact Farhaan114 (FraanKey).

Enjoy using this User Review Functionality! 😊
