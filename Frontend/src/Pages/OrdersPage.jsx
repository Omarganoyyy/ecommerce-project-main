import { Link } from 'react-router-dom'
import './OrdersPage.css'
import { NavBar } from '../Components/NavBar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

export function OrdersPage({ user }) {

    const [orders, setOrders] = useState([])

    useEffect(() => {
        const getOrdersData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/orders?expand=products")
                setOrders(response.data)
            } catch (error) {
                console.error('Error fetching orders:', error)
            }
        }
        getOrdersData()
    }, [])

    const handleAddToCart = async (productId, quantity) => {
        try {
            await axios.post("http://localhost:3000/api/cart-items", {
                productId,
                quantity
            })
        } catch (error) {
            console.error('Error adding product back to cart:', error)
        }
    }

    return (
        <>
            <NavBar user={user} />

            <div className="orders-page">
                <div className="page-title">Your Orders</div>

                <div className="orders-grid">

                    {orders.map((order) => (
                        <div key={order.id} className="order-container">

                            <div className="order-header">
                                <div className="order-header-left-section">
                                    <div className="order-date">
                                        <div className="order-header-label">Order Placed:</div>
                                        <div>{dayjs(order.orderTimeMs).format('MMMM D')}</div>
                                    </div>
                                    <div className="order-total">
                                        <div className="order-header-label">Total:</div>
                                        <div>${(order.totalCostCents / 100).toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="order-header-right-section">
                                    <div className="order-header-label">Order ID:</div>
                                    <div>{order.id}</div>
                                </div>
                            </div>

                            {order.products?.map((product) => (
                                <div key={`${order.id}-${product.productId}`} className="order-details-grid">

                                    <div className="product-image-container">
                                        <img src={product.product?.image} alt={product.product?.name || 'Product'} />
                                    </div>

                                    <div className="product-details">
                                        <div className="product-name">
                                            {product.product?.name}
                                        </div>
                                        <div className="product-delivery-date">
                                            Arriving on: {dayjs(product.estimatedDeliveryTimeMs).format('MMMM D')}
                                        </div>
                                        <div className="product-quantity">
                                            Quantity: {product.quantity}
                                        </div>
                                        <button
                                            className="buy-again-button button-primary"
                                            onClick={() => handleAddToCart(product.productId, product.quantity)}
                                        >
                                            <img className="buy-again-icon" src="images/icons/buy-again.png" alt="Buy again" />
                                            <span className="buy-again-message">Add to Cart</span>
                                        </button>
                                    </div>

                                    <div className="product-actions">
                                        <Link to={`/tracking?orderId=${encodeURIComponent(order.id)}`}>
                                            <button className="track-package-button button-secondary">
                                                Track package
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}


                        </div>
                    ))}

                </div>
            </div>
        </>
    )
}