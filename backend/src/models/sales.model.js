/**
 * Sales Model - PostgreSQL CREATE TABLE query for sales_transactions table
 * Contains all TruEstate fields for retail sales data
 */

const CREATE_SALES_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS sales_transactions (
    transaction_id VARCHAR(255) PRIMARY KEY,
    date DATE,
    customer_id VARCHAR(255),
    customer_name VARCHAR(255),
    phone_number VARCHAR(50),
    gender VARCHAR(20),
    age INTEGER,
    customer_region VARCHAR(255),
    customer_type VARCHAR(100),
    product_id VARCHAR(255),
    product_name VARCHAR(500),
    brand VARCHAR(255),
    product_category VARCHAR(255),
    tags TEXT,
    quantity INTEGER,
    price_per_unit DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    total_amount DECIMAL(10, 2),
    final_amount DECIMAL(10, 2),
    payment_method VARCHAR(100),
    order_status VARCHAR(100),
    delivery_type VARCHAR(100),
    store_id VARCHAR(255),
    store_location VARCHAR(255),
    salesperson_id VARCHAR(255),
    employee_name VARCHAR(255)
  );
`;

module.exports = {
  CREATE_SALES_TABLE_QUERY
};


