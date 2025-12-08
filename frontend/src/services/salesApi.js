/**
 * Sales API Service
 * Handles API calls to the sales endpoint
 */

/**
 * Fetch sales summary statistics
 * @returns {Promise<Object>} - Summary data with totalUnits, totalAmount, totalDiscount
 */
export async function fetchSalesSummary() {
  try {
    const response = await fetch('/api/sales/summary');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    throw error;
  }
}

/**
 * Fetch sales data with pagination, search, filters, and sorting
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {string} params.search - Search query for customer name or phone (optional)
 * @param {string} params.gender - Filter by gender (optional)
 * @param {string} params.region - Filter by customer region (optional)
 * @param {string} params.minAge - Minimum age filter (optional)
 * @param {string} params.maxAge - Maximum age filter (optional)
 * @param {string} params.product_category - Filter by product category (optional)
 * @param {string} params.payment_method - Filter by payment method (optional)
 * @param {string} params.startDate - Start date for date range filter (optional)
 * @param {string} params.endDate - End date for date range filter (optional)
 * @param {string} params.sortBy - Sort column (date, quantity, customer_name) (optional)
 * @returns {Promise<Object>} - Response data with sales records
 */
export async function fetchSales({
  page = 1,
  search = '',
  gender = '',
  region = '',
  minAge = '',
  maxAge = '',
  product_category = '',
  payment_method = '',
  startDate = '',
  endDate = '',
  sortBy = ''
} = {}) {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    if (gender) {
      params.append('gender', gender);
    }
    if (region) {
      params.append('customer_region', region);
    }
    if (minAge) {
      params.append('minAge', minAge);
    }
    if (maxAge) {
      params.append('maxAge', maxAge);
    }
    if (product_category) {
      params.append('product_category', product_category);
    }
    if (payment_method) {
      params.append('payment_method', payment_method);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    if (sortBy) {
      params.append('sortBy', sortBy);
    }
    
    const url = `/api/sales?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
}

