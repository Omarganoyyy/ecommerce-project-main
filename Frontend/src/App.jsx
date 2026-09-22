import { Routes, Route } from 'react-router-dom'
import { HomePage } from './Pages/HomePage'
import './App.css'
import { OrdersPage } from './Pages/OrdersPage'
import { TrackingPage } from './Pages/TrackingPage'
import { CheckOutPage } from './Pages/CheckOutPage'
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {

  const [cart, setCart] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3000/api/cart-items?expand=product")
      .then((response) => {
        setCart(response.data)
      })
  }, [])

  return (
    <Routes>
      <Route path='/' element={<HomePage />}></Route>
      <Route path='/orders' element={<OrdersPage />}></Route>
      <Route path='/tracking' element={<TrackingPage />}></Route>
      <Route path='/checkout' element={<CheckOutPage cart={cart} />}></Route>
    </Routes>
  )
}

export default App