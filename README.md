# Odin Members-Only Club

A simple private club web app built with **Node.js**, **Express**, **PostgreSQL/Sequelize**, and **EJS** templates.  
Users can sign up, log in, create messages, and join the club using a secret passcode. Admin users can delete messages.

---

## Features

- User authentication with **Passport.js** and **bcrypt** password hashing
- Sign-up form with confirm-password validation
- Optional admin creation (demo/testing)
- Club membership via secret passcode
- Members-only view of message authors and timestamps
- Admin-only ability to delete messages
- Flash messages for success/error notifications
- Fully responsive EJS templates

---

## Tech Stack

- Node.js + Express
- PostgreSQL (or SQLite for local dev)
- Sequelize ORM
- Passport.js for authentication
- EJS templates
- connect-flash for flash messages
- dotenv for environment variables

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/odin-members-only.git
cd odin-members-only
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file** in the project root:

```env
# PostgreSQL connection (or SQLite fallback)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/clubdb

# Session secret
SESSION_SECRET=devsecret123

# Secret passcode for joining the club
CLUB_PASSCODE=letmein123

# Admin creation protection
ADMIN_CREATION_PROTECTED=true
```

> Adjust the `DATABASE_URL` according to your local Postgres credentials.
> For quick dev, you can use SQLite (see `models/index.js` fallback).

4. **Create the database** (if using Postgres):

```bash
psql -U postgres
CREATE DATABASE clubdb;
\q
```

---

## Running the App

Start the development server:

```bash
npx nodemon app.js
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## Usage

1. **Sign up** as a new user (optionally as admin for testing)
2. **Log in**
3. **Join the club** using the secret passcode
4. **Create messages** — only members can see authors and timestamps
5. **Admin users** can delete messages

---

## Project Structure

```
odin-members-only/
│
├─ app.js               # Main server
├─ package.json
├─ .env
├─ models/
│   ├─ index.js
│   ├─ user.js
│   └─ message.js
├─ routes/
│   ├─ auth.js
│   ├─ index.js
│   └─ messages.js
├─ views/
│   ├─ layout.ejs
│   ├─ home.ejs
│   ├─ login.ejs
│   ├─ signup.ejs
│   ├─ join-club.ejs
│   ├─ new-message.ejs
│   └─ partials/
│       └─ flash.ejs
└─ public/
    └─ css/
        └─ style.css
```

---

## Deployment

You can deploy this app on platforms like:

* **Render**
* **Heroku**
* **Railway**
* **Fly.io**

**Steps:**

1. Push code to GitHub
2. Connect your repo to the PaaS
3. Set environment variables (`DATABASE_URL`, `SESSION_SECRET`, `CLUB_PASSCODE`)
4. Ensure PostgreSQL database is configured
5. Deploy

---

## Notes

* For **development**, you can use SQLite to avoid installing Postgres.
* Passwords are hashed using **bcrypt**.
* Only users who join the club can see the author of messages.
* Admin users are marked with a checkbox during signup (for demo).
