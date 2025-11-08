import { Routes, Route, Link } from 'react-router-dom'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import { useCart } from './context/CartContext'
import './App.css'

function App() {
  const { cart } = useCart()
  const itemCount = cart?.items?.length || 0

  return (
    <div>
      <nav className="main-nav" style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          MERN E-Commerce
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Products
          </Link>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
            Cart
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                backgroundColor: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
