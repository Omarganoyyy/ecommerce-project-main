import { Routes, Route } from 'react-router-dom'
import { HomePage } from './Pages/HomePage'
import './App.css'
import { OrdersPage } from './Pages/OrdersPage'
import { TrackingPage } from './Pages/TrackingPage'
import { CheckOutPage } from './Pages/CheckOutPage'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { SearchPage } from './Pages/SearchPage'

function App() {

  const [cart, setCart] = useState([])

  useEffect(() => {
    const getCartData = async () => {
      const response = await axios.get("http://localhost:3000/api/cart-items?expand=product")

      setCart(response.data)
    }
    getCartData()
  }, [])

  const [products, setProducts] = useState([])

  useEffect(() => {
    const getProductsData = async () => {
      const response = await axios.get("http://localhost:3000/api/products")
      setProducts(response.data)
    }
    getProductsData()
  }, [])


  return (
    <Routes>
      <Route path='/' element={<HomePage products={products} />}></Route>
      <Route path='/orders' element={<OrdersPage cart={cart} />}></Route>
      <Route path='/tracking' element={<TrackingPage />}></Route>
      <Route path='/checkout' element={<CheckOutPage cart={cart} />}></Route>
      <Route path='/search' element={<SearchPage products={products} />}></Route>
    </Routes>
  )
}

export default App