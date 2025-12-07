/**
 * Import Dataset Utility
 * Streams large CSV files, cleans data, and batch inserts into PostgreSQL
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Pool } = require('pg');
const { CREATE_SALES_TABLE_QUERY } = require('../models/sales.model');

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'retail_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Batch size for inserts
// PostgreSQL has a limit of 65535 parameters per query
// With 26 columns per row, max batch size = 65535 / 26 ≈ 2520
// Using 2000 for safety margin
const BATCH_SIZE = 2000;

/**
 * Get value from row with multiple possible column name formats
 */
function getValue(row, ...possibleKeys) {
  for (const key of possibleKeys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return row[key];
    }
  }
  return null;
}

/**
 * Clean and normalize a single row of data
 * Returns null if transaction_id is missing (row should be skipped)
 */
function cleanRow(row) {
  // Helper function to trim strings
  const trim = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      return trimmed === '' ? null : trimmed;
    }
    return val;
  };
  
  // Helper function to convert to number
  const toNumber = (val) => {
    if (val === null || val === undefined || val === '') return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };
  
  // Helper function to convert to integer
  const toInt = (val) => {
    if (val === null || val === undefined || val === '') return null;
    const num = parseInt(val, 10);
    return isNaN(num) ? null : num;
  };
  
  // Helper function to parse date
  const parseDate = (val) => {
    if (!val || val === '') return null;
    const trimmed = trim(val);
    if (!trimmed) return null;
    // Try to parse common date formats
    const date = new Date(trimmed);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  };

  // Get transaction_id with multiple possible column name formats
  const transactionId = trim(
    getValue(row, 'transaction_id', 'Transaction ID', 'Transaction Id', 'transaction id')
  );

  // Skip rows without transaction_id (required primary key)
  if (!transactionId) {
    return null;
  }

  const cleaned = {};
  cleaned.transaction_id = transactionId;
  cleaned.date = parseDate(getValue(row, 'date', 'Date'));
  cleaned.customer_id = trim(getValue(row, 'customer_id', 'Customer ID', 'Customer Id', 'customer id'));
  cleaned.customer_name = trim(getValue(row, 'customer_name', 'Customer Name', 'customer name'));
  cleaned.phone_number = trim(getValue(row, 'phone_number', 'Phone Number', 'phone number'));
  cleaned.gender = trim(getValue(row, 'gender', 'Gender'));
  cleaned.age = toInt(getValue(row, 'age', 'Age'));
  cleaned.customer_region = trim(getValue(row, 'customer_region', 'Customer Region', 'customer region'));
  cleaned.customer_type = trim(getValue(row, 'customer_type', 'Customer Type', 'customer type'));
  cleaned.product_id = trim(getValue(row, 'product_id', 'Product ID', 'Product Id', 'product id'));
  cleaned.product_name = trim(getValue(row, 'product_name', 'Product Name', 'product name'));
  cleaned.brand = trim(getValue(row, 'brand', 'Brand'));
  cleaned.product_category = trim(getValue(row, 'product_category', 'Product Category', 'product category'));
  cleaned.tags = trim(getValue(row, 'tags', 'Tags'));
  cleaned.quantity = toInt(getValue(row, 'quantity', 'Quantity'));
  cleaned.price_per_unit = toNumber(getValue(row, 'price_per_unit', 'Price per Unit', 'Price Per Unit', 'price per unit'));
  cleaned.discount_percentage = toNumber(getValue(row, 'discount_percentage', 'Discount Percentage', 'discount percentage'));
  cleaned.total_amount = toNumber(getValue(row, 'total_amount', 'Total Amount', 'total amount'));
  cleaned.final_amount = toNumber(getValue(row, 'final_amount', 'Final Amount', 'final amount'));
  cleaned.payment_method = trim(getValue(row, 'payment_method', 'Payment Method', 'payment method'));
  cleaned.order_status = trim(getValue(row, 'order_status', 'Order Status', 'order status'));
  cleaned.delivery_type = trim(getValue(row, 'delivery_type', 'Delivery Type', 'delivery type'));
  cleaned.store_id = trim(getValue(row, 'store_id', 'Store ID', 'Store Id', 'store id'));
  cleaned.store_location = trim(getValue(row, 'store_location', 'Store Location', 'store location'));
  cleaned.salesperson_id = trim(getValue(row, 'salesperson_id', 'Salesperson ID', 'Salesperson Id', 'salesperson id'));
  cleaned.employee_name = trim(getValue(row, 'employee_name', 'Employee Name', 'employee name'));

  return cleaned;
}

/**
 * Batch insert rows into PostgreSQL
 */
async function batchInsert(rows) {
  if (rows.length === 0) return;

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    for (const row of rows) {
      const rowPlaceholders = [];
      for (let i = 0; i < 26; i++) {
        rowPlaceholders.push(`$${paramIndex++}`);
      }
      placeholders.push(`(${rowPlaceholders.join(', ')})`);
      
      values.push(
        row.transaction_id,
        row.date,
        row.customer_id,
        row.customer_name,
        row.phone_number,
        row.gender,
        row.age,
        row.customer_region,
        row.customer_type,
        row.product_id,
        row.product_name,
        row.brand,
        row.product_category,
        row.tags,
        row.quantity,
        row.price_per_unit,
        row.discount_percentage,
        row.total_amount,
        row.final_amount,
        row.payment_method,
        row.order_status,
        row.delivery_type,
        row.store_id,
        row.store_location,
        row.salesperson_id,
        row.employee_name
      );
    }

    const query = `
      INSERT INTO sales_transactions (
        transaction_id, date, customer_id, customer_name, phone_number,
        gender, age, customer_region, customer_type, product_id,
        product_name, brand, product_category, tags, quantity,
        price_per_unit, discount_percentage, total_amount, final_amount,
        payment_method, order_status, delivery_type, store_id,
        store_location, salesperson_id, employee_name
      ) VALUES ${placeholders.join(', ')}
      ON CONFLICT (transaction_id) DO UPDATE SET
        date = EXCLUDED.date,
        customer_id = EXCLUDED.customer_id,
        customer_name = EXCLUDED.customer_name,
        phone_number = EXCLUDED.phone_number,
        gender = EXCLUDED.gender,
        age = EXCLUDED.age,
        customer_region = EXCLUDED.customer_region,
        customer_type = EXCLUDED.customer_type,
        product_id = EXCLUDED.product_id,
        product_name = EXCLUDED.product_name,
        brand = EXCLUDED.brand,
        product_category = EXCLUDED.product_category,
        tags = EXCLUDED.tags,
        quantity = EXCLUDED.quantity,
        price_per_unit = EXCLUDED.price_per_unit,
        discount_percentage = EXCLUDED.discount_percentage,
        total_amount = EXCLUDED.total_amount,
        final_amount = EXCLUDED.final_amount,
        payment_method = EXCLUDED.payment_method,
        order_status = EXCLUDED.order_status,
        delivery_type = EXCLUDED.delivery_type,
        store_id = EXCLUDED.store_id,
        store_location = EXCLUDED.store_location,
        salesperson_id = EXCLUDED.salesperson_id,
        employee_name = EXCLUDED.employee_name
    `;

    await client.query(query, values);
    await client.query('COMMIT');
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main import function
 */
async function importDataset(csvFilePath) {
  console.log('Starting dataset import...');
  console.log(`CSV file: ${csvFilePath}`);
  
  const startTime = Date.now();
  let totalRows = 0;
  let processedRows = 0;
  let batch = [];
  let errors = [];
  let insertPromise = Promise.resolve();

  try {
    // Create table if it doesn't exist
    console.log('Creating sales_transactions table...');
    await pool.query(CREATE_SALES_TABLE_QUERY);
    console.log('Table created/verified successfully.');

    // Stream and process CSV
    // Configure csv-parser to map headers to lowercase with underscores
    const result = await new Promise((resolve, reject) => {
      // Use file stream options to prevent Windows file locking issues
      const fileStream = fs.createReadStream(csvFilePath, {
        encoding: 'utf8',
        highWaterMark: 64 * 1024 // 64KB buffer for better performance
      });
      
      const stream = fileStream.pipe(
        csv({
          mapHeaders: ({ header }) => {
            // Convert "Transaction ID" -> "transaction_id", "Customer Name" -> "customer_name", etc.
            return header
              .trim()
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '');
          }
        })
      );
      
      stream.on('data', (row) => {
        totalRows++;
        
        try {
          const cleanedRow = cleanRow(row);
          
          // Skip rows without transaction_id
          if (!cleanedRow) {
            return;
          }
          
          batch.push(cleanedRow);

          // When batch is full, queue the insert (don't pause stream - let it backpressure naturally)
          if (batch.length >= BATCH_SIZE) {
            const currentBatch = [...batch];
            batch = [];
            
            // Chain the insert promise to ensure sequential processing
            // The stream will naturally backpressure if inserts are slower than reading
            insertPromise = insertPromise.then(async () => {
              try {
                await batchInsert(currentBatch);
                processedRows += currentBatch.length;
                console.log(`Processed ${processedRows} rows...`);
              } catch (error) {
                errors.push({ batch: processedRows, error: error.message });
                console.error(`Error inserting batch: ${error.message}`);
              }
            }).catch((error) => {
              errors.push({ batch: processedRows, error: error.message });
              console.error(`Error in insert chain: ${error.message}`);
            });
          }
        } catch (error) {
          errors.push({ row: totalRows, error: error.message });
          console.error(`Error processing row ${totalRows}: ${error.message}`);
        }
      })
      .on('end', async () => {
        try {
          // Wait for any pending inserts
          await insertPromise;
          
          // Insert remaining rows
          if (batch.length > 0) {
            await batchInsert(batch);
            processedRows += batch.length;
            console.log(`Processed final batch of ${batch.length} rows...`);
          }

          const endTime = Date.now();
          const duration = ((endTime - startTime) / 1000).toFixed(2);
          
          console.log('\n=== Import Complete ===');
          console.log(`Total rows read: ${totalRows}`);
          console.log(`Rows processed: ${processedRows}`);
          console.log(`Errors: ${errors.length}`);
          console.log(`Duration: ${duration} seconds`);
          
          if (errors.length > 0) {
            console.log('\nErrors encountered:');
            errors.slice(0, 10).forEach(err => {
              console.log(`  Row ${err.row || err.batch}: ${err.error}`);
            });
            if (errors.length > 10) {
              console.log(`  ... and ${errors.length - 10} more errors`);
            }
          }
          
          resolve({ totalRows, processedRows, errors: errors.length, duration });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        // Handle stream errors gracefully
        if (error.code === 'EBUSY') {
          console.error('File is locked by another process. Please close any programs accessing the CSV file.');
        } else {
          console.error('Stream error:', error.message);
        }
        reject(error);
      });
    });

    return result;
  } catch (error) {
    console.error('Fatal error during import:', error);
    throw error;
  } finally {
    // Close pool only after all operations complete
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run import if called directly
if (require.main === module) {
  const csvFilePath = process.argv[2] || path.join(__dirname, 'truestate_assignment_dataset.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`Error: CSV file not found at ${csvFilePath}`);
    console.error('Usage: node importDataset.js [path/to/file.csv]');
    process.exit(1);
  }

  importDataset(csvFilePath)
    .then((result) => {
      console.log('\nImport completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nImport failed:', error);
      process.exit(1);
    });
}

module.exports = { importDataset, cleanRow, batchInsert };

