import { useEffect, useState } from 'react';
import { NavBar } from '../Components/NavBar';
import './CheckOutPage.css';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export function CheckOutPage({ cart, loadCart, user }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCheckoutData = async () => {
    try {
      const [deliveryRes, summaryRes] = await Promise.all([
        axios.get('http://localhost:3000/api/delivery-options?expand=estimatedDeliveryTime'),
        axios.get('http://localhost:3000/api/payment-summary')
      ]);

      setDeliveryOptions(deliveryRes.data);
      setPaymentSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching checkout data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const handleDeliveryOptionChange = async (productId, deliveryOptionId) => {
    try {
      await axios.put(`http://localhost:3000/api/cart-items/${productId}`, {
        deliveryOptionId: deliveryOptionId
      });

      if (loadCart) await loadCart();
      await fetchCheckoutData();
    } catch (error) {
      console.error('Failed to update delivery option:', error);
    }
  };

  const handleQuantityChange = async (productId, nextQuantity) => {
    if (nextQuantity < 1) {
      return handleDeleteItem(productId);
    }

    try {
      await axios.put(`http://localhost:3000/api/cart-items/${productId}`, {
        quantity: nextQuantity
      });

      if (loadCart) await loadCart();
      await fetchCheckoutData();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart-items/${productId}`);
      if (loadCart) await loadCart();
      await fetchCheckoutData();
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await axios.post('http://localhost:3000/api/orders');
      if (loadCart) await loadCart();
      navigate('/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  if (isLoading || !paymentSummary) {
    return (
      <>
        <NavBar user={user} />
        <div className="checkout-page">Loading checkout details...</div>
      </>
    );
  }

  const taxPercentage = paymentSummary.totalCostBeforeTaxCents > 0
    ? ((paymentSummary.taxCents / paymentSummary.totalCostBeforeTaxCents) * 100).toFixed(0)
    : 10;

  return (
    <>
      <NavBar user={user} />
      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {cart.map((item) => {
              const selectDeliveryOption = deliveryOptions.find(
                (option) => option.id === item.deliveryOptionId
              );

              return (
                <div key={item.id || item.productId} className="cart-item-container">
                  <div className="delivery-date">
                    Delivery date:{' '}
                    {selectDeliveryOption
                      ? dayjs(selectDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')
                      : 'Selecting...'}
                  </div>

                  <div className="cart-item-details-grid">
                    <img
                      className="checkout-product-image"
                      src={item.product?.image}
                      alt={item.product?.name || 'Product'}
                    />

                    <div className="cart-item-details">
                      <div className="product-name">{item.product?.name}</div>
                      <div className="product-price">
                        ${((item.product?.priceCents || 0) / 100).toFixed(2)}
                      </div>
                      <div className="product-quantity">
                        <span>
                          Quantity: <span className="quantity-label">{item.quantity}</span>
                        </span>
                        <button
                          type="button"
                          className="update-quantity-link link-primary"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        >
                          Remove one
                        </button>
                        <button
                          type="button"
                          className="delete-quantity-link link-primary"
                          onClick={() => handleDeleteItem(item.productId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="delivery-options">
                      <div className="delivery-options-title">Choose a delivery option:</div>

                      {deliveryOptions.map((option) => (
                        <div
                          key={option.id}
                          className="delivery-option"
                          onClick={() => handleDeliveryOptionChange(item.productId || item.id, option.id)}
                        >
                          <input
                            type="radio"
                            checked={option.id === item.deliveryOptionId}
                            onChange={() => handleDeliveryOptionChange(item.productId || item.id, option.id)}
                            className="delivery-option-input"
                            name={`delivery-option-${item.productId || item.id}`}
                          />
                          <div>
                            <div className="delivery-option-date">
                              {dayjs(option.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                            </div>
                            <div className="delivery-option-price">
                              {option.priceCents !== 0
                                ? `$${(option.priceCents / 100).toFixed(2)} - Shipping`
                                : 'FREE SHIPPING'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>

            <div className="payment-summary-row">
              <div>Items ({paymentSummary.totalItems}):</div>
              <div className="payment-summary-money">
                ${(paymentSummary.productCostCents / 100).toFixed(2)}
              </div>
            </div>

            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">
                ${(paymentSummary.shippingCostCents / 100).toFixed(2)}
              </div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">
                ${(paymentSummary.totalCostBeforeTaxCents / 100).toFixed(2)}
              </div>
            </div>

            <div className="payment-summary-row">
              <div>Estimated tax ({taxPercentage}%):</div>
              <div className="payment-summary-money">
                ${(paymentSummary.taxCents / 100).toFixed(2)}
              </div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">
                ${(paymentSummary.totalCostCents / 100).toFixed(2)}
              </div>
            </div>

            <button className="place-order-button button-primary" onClick={handlePlaceOrder}>Place your order</button>
          </div>
        </div>
      </div>
    </>
  );
}