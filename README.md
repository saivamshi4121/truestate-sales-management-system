# Retail Sales Management System

## Overview

A high-performance Retail Sales Management System built for the TruEstate SDE Intern assignment. The system handles 1 million+ sales records with production-grade performance, featuring real-time search, filtering, sorting, and pagination capabilities. Built with PostgreSQL for data storage, Express.js for the backend API, and React for the frontend interface.

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL (pg library)
- **Frontend**: React 18, Vite
- **Database**: PostgreSQL with indexed columns for optimized queries
- **Data Import**: Node.js streaming with csv-parser (batch size: 2000 rows)
- **API Communication**: RESTful API with query parameter-based filtering

## Search Implementation Summary

The search functionality implements debounced input with a 1-second delay to minimize API calls. Users can search by customer name or phone number using case-insensitive matching. The search query is processed on the backend using PostgreSQL's LOWER() function for case-insensitive comparison across both customer_name and phone_number columns. The debounce mechanism ensures the API is only called 500ms after the user stops typing, reducing server load and improving performance.

## Filter Implementation Summary

The system supports six filter categories: gender (Male/Female), customer region (North/South/East/West), age range (minAge/maxAge), product category (Electronics/Clothing/Grocery/Beauty), payment method (UPI/Card/Cash), and date range (startDate/endDate). All filters are applied server-side using dynamic SQL query building with parameterized queries to prevent SQL injection. Filters can be combined for multi-criteria filtering, and the page automatically resets to 1 when any filter changes.

## Sorting Implementation Summary

Sorting is implemented with three options: date (newest first, default), quantity (ascending), and customer name (A-Z). The backend uses dynamic ORDER BY clauses with validated column names to ensure security. Sort order defaults to DESC for date and ASC for quantity and customer_name. The sorting is applied server-side before pagination, ensuring consistent results across pages.

## Pagination Implementation Summary

Pagination is implemented with a default page size of 10 records per page. The backend calculates total pages based on filtered results and returns both the paginated data and total count in a single response. The frontend displays "Page X of Y" information and provides Previous/Next navigation buttons that are automatically disabled at boundaries. Page resets to 1 whenever search, filters, or sorting changes to ensure users start from the first page of new results.

## Setup Instructions

1. **PostgreSQL Setup**: Install PostgreSQL and create a database named `retail_management`. Update the connection details in `backend/.env` (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD).

2. **Place CSV File**: Copy your sales dataset CSV file to `backend/src/utils/truestate_assignment_dataset.csv`.

3. **Import Data**: Navigate to the backend directory and run `npm install`, then execute `npm run import` to stream and import the 1 million records into PostgreSQL. The import script creates the sales_transactions table automatically and processes data in batches of 2000 rows.

4. **Start Backend**: In the backend directory, run `node src/index.js` (or `npm start` if configured). The server will start on port 3000 by default.

5. **Start Frontend**: Navigate to the frontend directory, run `npm install`, then execute `npm run dev`. The frontend will be available at `http://localhost:5173` with API proxy configured to the backend.

