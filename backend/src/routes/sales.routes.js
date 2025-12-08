/**
 * Sales Routes
 * Defines API endpoints for sales operations
 */

const express = require('express');
const router = express.Router();
const { getSalesController, getSalesSummaryController } = require('../controllers/sales.controller');

/**
 * GET /api/sales
 * Get sales with filters, search, sorting, and pagination
 * 
 * Query Parameters:
 * - search: Search in customer_name and phone_number (case-insensitive)
 * - customer_region: Filter by customer region
 * - gender: Filter by gender
 * - minAge: Minimum age filter
 * - maxAge: Maximum age filter
 * - product_category: Filter by product category
 * - payment_method: Filter by payment method
 * - startDate: Start date for date range filter (YYYY-MM-DD)
 * - endDate: End date for date range filter (YYYY-MM-DD)
 * - sortBy: Sort column (date, quantity, customer_name) - default: date
 * - sortOrder: Sort order (ASC, DESC) - default: DESC
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 */
router.get('/', getSalesController);

/**
 * GET /api/sales/summary
 * Get sales summary statistics (total units, total amount, total discount)
 */
router.get('/summary', getSalesSummaryController);

module.exports = router;


