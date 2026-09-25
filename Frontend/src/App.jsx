import { Routes, Route } from 'react-router-dom'
import { HomePage } from './Pages/HomePage'
import './App.css'
import { OrdersPage } from './Pages/OrdersPage'
import { TrackingPage } from './Pages/TrackingPage'
import { CheckOutPage } from './Pages/CheckOutPage'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { SearchPage } from './Pages/SearchPage'
import { LoginPage } from './Pages/LoginPage'
import { SignupPage } from './Pages/SignupPage'
import { ProfilePage } from './Pages/ProfilePage'

function App() {
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('luraUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const loadCart = async () => {
    const token = localStorage.getItem('luraToken')
    if (!token) {
      setCart([])
      return
    }

    const response = await axios.get('http://localhost:3000/api/cart-items?expand=product', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setCart(response.data)
  }

  useEffect(() => {
    loadCart()
  }, [])

  useEffect(() => {
    const getProductsData = async () => {
      const response = await axios.get('http://localhost:3000/api/products')
      setProducts(response.data)
    }
    getProductsData()
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem('luraUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])


  return (
    <Routes>
      <Route path='/' element={<HomePage products={products} loadCart={loadCart} user={user} />}></Route>
      <Route path='/orders' element={<OrdersPage user={user} />}></Route>
      <Route path='/tracking/:orderId?' element={<TrackingPage user={user} />}></Route>
      <Route path='/checkout' element={<CheckOutPage cart={cart} loadCart={loadCart} user={user} />}></Route>
      <Route path='/search' element={<SearchPage products={products} loadCart={loadCart} user={user} />}></Route>
      <Route path='/login' element={<LoginPage onLogin={setUser} />} />
      <Route path='/signup' element={<SignupPage onLogin={setUser} />} />
      <Route path='/profile' element={<ProfilePage user={user} onLogout={setUser}/>} />
    </Routes>
  )
}

export default App