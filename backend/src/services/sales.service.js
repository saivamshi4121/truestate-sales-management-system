/**
 * Sales Service
 * Handles business logic for sales data queries
 */

const pool = require('../config/database');

/**
 * Build dynamic SQL query for sales with filters, search, sorting, and pagination
 * @param {Object} filters - Filter parameters
 * @returns {Object} - { data, total }
 */
async function getSales(filters = {}) {
  const {
    search,
    customer_region,
    gender,
    minAge,
    maxAge,
    product_category,
    payment_method,
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'DESC',
    page = 1,
    limit = 10
  } = filters;

  // Build WHERE clause conditions
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  // Search on customer_name and phone_number (case-insensitive)
  if (search) {
    conditions.push(
      `(LOWER(customer_name) LIKE LOWER($${paramIndex}) OR LOWER(phone_number) LIKE LOWER($${paramIndex}))`
    );
    values.push(`%${search}%`);
    paramIndex++;
  }

  // Filter: customer_region
  if (customer_region) {
    conditions.push(`customer_region = $${paramIndex}`);
    values.push(customer_region);
    paramIndex++;
  }

  // Filter: gender
  if (gender) {
    conditions.push(`gender = $${paramIndex}`);
    values.push(gender);
    paramIndex++;
  }

  // Filter: age range
  if (minAge !== undefined && minAge !== null && minAge !== '') {
    conditions.push(`age >= $${paramIndex}`);
    values.push(parseInt(minAge, 10));
    paramIndex++;
  }

  if (maxAge !== undefined && maxAge !== null && maxAge !== '') {
    conditions.push(`age <= $${paramIndex}`);
    values.push(parseInt(maxAge, 10));
    paramIndex++;
  }

  // Filter: product_category
  if (product_category) {
    conditions.push(`product_category = $${paramIndex}`);
    values.push(product_category);
    paramIndex++;
  }

  // Filter: payment_method
  if (payment_method) {
    conditions.push(`payment_method = $${paramIndex}`);
    values.push(payment_method);
    paramIndex++;
  }

  // Filter: date range
  if (startDate) {
    conditions.push(`date >= $${paramIndex}`);
    values.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    conditions.push(`date <= $${paramIndex}`);
    values.push(endDate);
    paramIndex++;
  }

  // Build WHERE clause
  const whereClause = conditions.length > 0 
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Validate and set sort column
  const validSortColumns = {
    'date': 'date',
    'quantity': 'quantity',
    'customer_name': 'customer_name'
  };
  const sortColumn = validSortColumns[sortBy.toLowerCase()] || 'date';

  // Validate sort order
  const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // Calculate offset for pagination
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  // Build the main query with pagination
  const dataQuery = `
    SELECT 
      transaction_id,
      date,
      customer_id,
      customer_name,
      phone_number,
      gender,
      age,
      customer_region,
      customer_type,
      product_id,
      product_name,
      brand,
      product_category,
      tags,
      quantity,
      price_per_unit,
      discount_percentage,
      total_amount,
      final_amount,
      payment_method,
      order_status,
      delivery_type,
      store_id,
      store_location,
      salesperson_id,
      employee_name
    FROM sales_transactions
    ${whereClause}
    ORDER BY ${sortColumn} ${validSortOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  values.push(parseInt(limit, 10));
  values.push(offset);

  // Build count query for total records
  const countQuery = `
    SELECT COUNT(*) as total
    FROM sales_transactions
    ${whereClause}
  `;

  try {
    // Execute both queries in parallel
    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, values),
      pool.query(countQuery, values.slice(0, -2)) // Remove LIMIT and OFFSET params for count
    ]);

    return {
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].total, 10)
    };
  } catch (error) {
    console.error('Error in getSales service:', error);
    throw error;
  }
}

/**
 * Get sales summary statistics
 * @returns {Object} - { totalUnits, totalAmount, totalDiscount }
 */
async function getSalesSummary() {
  const summaryQuery = `
    SELECT 
      COALESCE(SUM(quantity), 0) as total_units,
      COALESCE(SUM(total_amount), 0) as total_amount,
      COALESCE(SUM(total_amount - final_amount), 0) as total_discount
    FROM sales_transactions
  `;

  try {
    const result = await pool.query(summaryQuery);
    const row = result.rows[0];

    return {
      totalUnits: parseInt(row.total_units, 10) || 0,
      totalAmount: parseFloat(row.total_amount) || 0,
      totalDiscount: parseFloat(row.total_discount) || 0
    };
  } catch (error) {
    console.error('Error in getSalesSummary service:', error);
    throw error;
  }
}

module.exports = {
  getSales,
  getSalesSummary
};


