# Deployment Guide: Render + PostgreSQL

Follow these steps to deploy your Restaurant Table Booking app to Render.

## Prerequisites
1.  A [GitHub account](https://github.com/) with this code pushed to a repository.
2.  A [Render account](https://render.com/).

## Step 1: Create a New Blueprint
1.  Log in to your **Render Dashboard**.
2.  Click the **New +** button in the top right corner.
3.  Select **Blueprint**.
4.  Connect your GitHub account if you haven't already.
5.  Search for and select your **Tablebooking1-1** repository.
6.  Click **Connect**.

## Step 2: Configure the Blueprint
Render will automatically detect the `render.yaml` file in your repository.

1.  **Service Name**: You can leave the defaults (`restaurant-booking-app` and `restaurant-db`).
2.  **Environment Variables**: You will see a list of variables.
    *   `ADMIN_EMAIL`: Enter the email you want to use for the admin login (e.g., `admin@example.com`).
    *   `ADMIN_PASSWORD`: Enter a strong password for the admin user.
    *   `ADMIN_SECRET_KEY` and `JWT_SECRET`: These will be auto-generated, you don't need to touch them.
3.  Click **Apply**.

## Step 3: Wait for Deployment
Render will now:
1.  Create a PostgreSQL database.
2.  Build your Next.js application.
3.  Deploy the app.

This process may take a few minutes. You can watch the logs in the dashboard.

## Step 4: Database Setup (First Time Only)
Once the app is "Live", you need to set up the database schema and create the admin user.

1.  Go to the **Shell** tab of your `restaurant-booking-app` service in the Render dashboard.
2.  Run the following command to create the database tables:
    ```bash
    npx prisma migrate deploy
    ```
3.  Run the seed script to create your admin user and initial data:
    ```bash
    npm run seed
    ```
    *(Note: If `npm run seed` fails due to `ts-node`, try `npx ts-node --transpile-only prisma/seed.ts`)*

## Step 5: Verify Deployment
1.  Click the URL provided by Render (e.g., `https://restaurant-booking-app.onrender.com`).
2.  Go to `/admin/login`.
3.  Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in Step 2.

**Success!** Your app is now live.
