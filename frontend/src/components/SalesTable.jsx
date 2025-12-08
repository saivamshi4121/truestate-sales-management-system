import './SalesTable.css'

/**
 * SalesTable Component
 * Displays sales transactions in a responsive table
 * @param {Object} props
 * @param {Array} props.data - Array of sales transaction objects
 */
function SalesTable({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="sales-table-empty">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="sales-table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.transaction_id || '-'}</td>
              <td>{transaction.date || '-'}</td>
              <td>{transaction.customer_name || '-'}</td>
              <td>{transaction.phone_number || '-'}</td>
              <td>{transaction.gender || '-'}</td>
              <td>{transaction.age || '-'}</td>
              <td>{transaction.product_category || '-'}</td>
              <td>{transaction.quantity || '-'}</td>
              <td>
                {transaction.total_amount
                  ? `₹${parseFloat(transaction.total_amount).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                  : '-'}
              </td>
              <td>{transaction.payment_method || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesTable;


