import { Link } from 'react-router-dom'
import './NavBar.css'
import { ListOrdered, Search, ShoppingCart, UserRound } from 'lucide-react'
//order cart
export function NavBar() {
  return (
    <div className="navbar-container">
      <div className="leftside">
        <div className="first-logo">
          <Link>
            <UserRound />
            <p>LOGIN</p>
          </Link>
        </div>
        <div className="second-logo">
          <Link to='/search'>
            <Search />
            <p>SEACRH</p>
          </Link>
        </div>
      </div>

      <div className="middle">
        <Link to='/'>
          <h2>LURA</h2>
        </Link>
      </div>

      <div className="rightside">
        <Link to='/checkout'>
          <ShoppingCart />
          <p>CART</p>
        </Link>
        <Link to='/orders'>
          <ListOrdered />
          <p>ORDERS</p>
        </Link>
      </div>
    </div>
  )
}