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
git clone https://github.com/Farhaan114/RBAC-Review-System.git
cd RBAC-Review-System
```
## Install dependencies on the frontend and backend

```bash

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

npm start
or

nodemon index.js
```

## Screenshots\

- User Registration
 ![image](https://github.com/user-attachments/assets/6d576bb9-4ffe-4547-8c3c-e2da4905372e)


- User Login
  ![image](https://github.com/user-attachments/assets/8c23ba2f-3bb0-4afa-82b5-0e3fd5cde5bb)

  
- Update user roles
  ![image](https://github.com/user-attachments/assets/c91e6940-b152-4b81-be69-4af6cee5e464)


- Products Listing
  ![image](https://github.com/user-attachments/assets/a7bf9aa2-d4ae-4df1-bdd4-cd1cfd3697f6)



- View Product Reviews
  ![image](https://github.com/user-attachments/assets/624250fd-d113-429d-8e6b-f7e9531871df)



- Submit a Review
![image](https://github.com/user-attachments/assets/6c886528-825a-4f28-86f3-f25820ed2caa)


- User Can View Their Reviews
![image](https://github.com/user-attachments/assets/d2468d6f-3806-4190-a7d8-a424b2153edb)


- Edit a Review
![image](https://github.com/user-attachments/assets/7a4bc9c6-342d-4ea9-bfa0-660ad8ab0eca)


## Admin Login and Review Viewing
![image](https://github.com/user-attachments/assets/f27df7d1-98dd-43dd-a639-326c576418aa)

## Admin Dashboard available only for the admin
![image](https://github.com/user-attachments/assets/c747a153-b40a-4901-b839-3d81aa660f9a)
- Change roles:
  ![image](https://github.com/user-attachments/assets/6971b817-efe1-402d-986b-c5ca75e63ac2)
- View Moderators:
  ![image](https://github.com/user-attachments/assets/68798cbe-5f00-4197-b62d-e9599501f254)



## Admin or Moderator Deleting an Inappropriate Review
![image](https://github.com/user-attachments/assets/6575ae12-ee86-4660-bf7f-887b117ce91b)



View the API Documentation: Postman API Documentation
License
This project is licensed under the MIT License.

- Contact
-- For questions, please contact Farhaan114 (FraanKey).

Enjoy using this User Review Functionality! 😊
