# Smart Bookmark App

## Overview

Smart Bookmark App is a full-stack web application that allows authenticated users to create, view, and delete personal bookmarks securely.

The application is built using Next.js for the frontend and Supabase for authentication and database management. It is deployed on Vercel.

---

## Tech Stack

- Next.js
- Supabase (Authentication & PostgreSQL)
- Row Level Security (RLS)
- Vercel (Deployment)

---

## Features

- User Authentication (Sign up / Login)
- Add new bookmarks (Title + URL)
- Delete bookmarks
- User-specific data isolation
- Secure database access using RLS policies
- Deployed production-ready app

---

## Database Structure

Table: `bookmarks`

Columns:
- id (UUID)
- title (text)
- url (text)
- user_id (UUID - linked to authenticated user)
- created_at (timestamp)

---

## Authentication & Privacy

Authentication is handled using Supabase Auth.

Each bookmark record stores a `user_id`.  
Row Level Security (RLS) policies ensure that:

- Users can only insert their own records.
- Users can only read their own bookmarks.
- Users can only delete their own bookmarks.

This ensures complete user data privacy.

---

## Challenges Faced

1. Configuring Row Level Security correctly.
2. Ensuring user-specific data filtering.
3. Fixing deployment and environment variable issues on Vercel.
4. Debugging insert and delete permission errors.

All issues were resolved by properly configuring RLS policies and verifying environment variables.

---


## Live Demo

https://smart-book-ldx11oikn-alfiya-banu-js-projects.vercel.app


---

## How to Run Locally

```bash
npm install
npm run dev
