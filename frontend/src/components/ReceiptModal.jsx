import { formatCurrency } from '../utils/formatCurrency';

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Order Receipt</h2>
          <button onClick={onClose} style={{ background: '#dc3545' }}>Close</button>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Order ID:</strong> {receipt.orderId}</p>
          <p><strong>Date:</strong> {new Date(receipt.date).toLocaleString()}</p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {receipt.customer.name}</p>
          <p><strong>Email:</strong> {receipt.customer.email}</p>
          <p><strong>Address:</strong> {receipt.customer.address}</p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3>Order Items</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Product</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{item.product.name}</td>
                  <td style={{ textAlign: 'center', padding: '0.5rem' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>{formatCurrency(item.product.price)}</td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '2px solid #333',
          textAlign: 'right'
        }}>
          <h2>Total: {formatCurrency(receipt.total)}</h2>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: '#28a745' }}>Thank you for your purchase!</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;