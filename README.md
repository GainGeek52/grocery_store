# Groc Store (starter)

This is a starter full-stack grocery store app using Node.js, Express, MongoDB, Mongoose, EJS and Bootstrap.

Features included in the scaffold:
- User signup/login with bcrypt password hashing.
- Sessions using express-session and connect-mongo.
- Browse products, view product details, add to cart, checkout (simple order creation).
- Admin dashboard (login required) to add/edit/delete products.
- MVC structure with controllers, models, routes, and EJS views.

Getting started
1. Copy the repo and cd into it.
2. Create a `.env` file with the following variables:

```
MONGO_URI=mongodb://127.0.0.1:27017/groc
SESSION_SECRET=your_secret_here
PORT=3000
```

3. Install and run:

```powershell
npm install
npm run dev
```

Notes
- This is a starter scaffold. It does not include production hardening.
- Create an admin user in the database or sign up and set `isAdmin` to true for that user in MongoDB to access the admin dashboard.
