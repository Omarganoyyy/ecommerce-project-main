import { Link, useSearchParams } from 'react-router-dom'
import './TrackingPage.css'
import { NavBar } from '../Components/NavBar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

export function TrackingPage({ user }) {
    const [searchParams] = useSearchParams()
    const [order, setOrder] = useState(null)
    const orderId = searchParams.get('orderId')

    useEffect(() => {
        const getOrderData = async () => {
            if (!orderId) {
                setOrder(null)
                return
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/orders/${orderId}?expand=products`)
                setOrder(response.data)
            } catch (error) {
                console.error('Error fetching tracking details:', error)
                setOrder(null)
            }
        }

        getOrderData()
    }, [orderId])

    const displayedProduct = order?.products?.[0]

    return (
        <>
            <NavBar user={user} />

            <div className="tracking-page">
                <div className="order-tracking">
                    <Link className="back-to-orders-link link-primary" to="/orders">
                        View all orders
                    </Link>

                    {!order || !displayedProduct ? (
                        <div className="product-info">No tracking details available for this order.</div>
                    ) : (
                        <>
                            <div className="delivery-date">
                                Arriving on {dayjs(displayedProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                            </div>

                            <div className="product-info">
                                {displayedProduct.product?.name}
                            </div>

                            <div className="product-info">
                                Quantity: {displayedProduct.quantity}
                            </div>

                            <img className="product-image" src={displayedProduct.product?.image} alt={displayedProduct.product?.name} />

                            <div className="progress-labels-container">
                                <div className="progress-label">
                                    Preparing
                                </div>
                                <div className="progress-label current-status">
                                    Shipped
                                </div>
                                <div className="progress-label">
                                    Delivered
                                </div>
                            </div>

                            <div className="progress-bar-container">
                                <div className="progress-bar"></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}