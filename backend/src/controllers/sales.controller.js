/**
 * Sales Controller
 * Handles HTTP requests and responses for sales endpoints
 */

const { getSales, getSalesSummary } = require('../services/sales.service');

/**
 * Get sales with filters, search, sorting, and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getSalesController(req, res) {
  try {
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
      sortBy,
      sortOrder,
      page,
      limit
    } = req.query;

    // Validate and parse pagination parameters
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1 || isNaN(pageNum)) {
      return res.status(400).json({
        error: 'Invalid page parameter. Must be a positive integer.'
      });
    }

    if (limitNum < 1 || limitNum > 100 || isNaN(limitNum)) {
      return res.status(400).json({
        error: 'Invalid limit parameter. Must be between 1 and 100.'
      });
    }

    // Validate age parameters
    if (minAge !== undefined && minAge !== null && minAge !== '') {
      const minAgeNum = parseInt(minAge, 10);
      if (isNaN(minAgeNum) || minAgeNum < 0) {
        return res.status(400).json({
          error: 'Invalid minAge parameter. Must be a non-negative integer.'
        });
      }
    }

    if (maxAge !== undefined && maxAge !== null && maxAge !== '') {
      const maxAgeNum = parseInt(maxAge, 10);
      if (isNaN(maxAgeNum) || maxAgeNum < 0) {
        return res.status(400).json({
          error: 'Invalid maxAge parameter. Must be a non-negative integer.'
        });
      }
    }

    // Validate age range
    if (minAge !== undefined && maxAge !== undefined && 
        minAge !== null && maxAge !== null && 
        minAge !== '' && maxAge !== '') {
      const minAgeNum = parseInt(minAge, 10);
      const maxAgeNum = parseInt(maxAge, 10);
      if (minAgeNum > maxAgeNum) {
        return res.status(400).json({
          error: 'minAge cannot be greater than maxAge.'
        });
      }
    }

    // Build filters object
    const filters = {
      search,
      customer_region,
      gender,
      minAge,
      maxAge,
      product_category,
      payment_method,
      startDate,
      endDate,
      sortBy: sortBy || 'date',
      sortOrder: sortOrder || 'DESC',
      page: pageNum,
      limit: limitNum
    };

    // Call service to get sales data
    const { data, total } = await getSales(filters);

    // Calculate total pages
    const totalPages = Math.ceil(total / limitNum);

    // Return response
    res.json({
      data,
      total,
      page: pageNum,
      totalPages,
      limit: limitNum
    });
  } catch (error) {
    console.error('Error in getSalesController:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Get sales summary statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getSalesSummaryController(req, res) {
  try {
    const summary = await getSalesSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error in getSalesSummaryController:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

module.exports = {
  getSalesController,
  getSalesSummaryController
};


