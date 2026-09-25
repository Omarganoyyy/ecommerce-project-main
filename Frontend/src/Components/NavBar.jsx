import { Link } from 'react-router-dom'
import './NavBar.css'
import { ListOrdered, Search, ShoppingCart, UserRound } from 'lucide-react'

export function NavBar({ handleScrollToHero, user }) {
  const profileLink = user ? '/profile' : '/login'
    const userLabel = user ? `${user.firstName.toUpperCase()}` : 'LOGIN'


  return (
    <div className="navbar-container">
      <div className="leftside">
        <div className="first-logo">
          <Link to={profileLink}>
            <UserRound />
            <p>{userLabel}</p>
          </Link>
        </div>
        <div className="second-logo">
          <Link to='/search'>
            <Search />
            <p>SEARCH</p>
          </Link>
        </div>
      </div>

      <div className="middle">
        <Link to='/' onClick={handleScrollToHero}>
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