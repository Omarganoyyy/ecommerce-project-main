import { useEffect, useState } from 'react';
import { NavBar } from '../Components/NavBar';
import './CheckOutPage.css';
import axios from 'axios';
import dayjs from 'dayjs';

export function CheckOutPage({ cart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCheckoutData() {
      try {
        setIsLoading(true);

        // Fetch both API endpoints concurrently using async/await
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
    }

    fetchCheckoutData();
  }, []);

  if (isLoading || !paymentSummary) {
    return (
      <>
        <NavBar />
        <div className="checkout-page">Loading checkout details...</div>
      </>
    );
  }

  // Calculate tax percentage dynamically (e.g., 10%)
  const taxPercentage = paymentSummary.totalCostBeforeTaxCents > 0
    ? ((paymentSummary.taxCents / paymentSummary.totalCostBeforeTaxCents) * 100).toFixed(0)
    : 10;

  return (
    <>
      <NavBar />
      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {cart.map((item) => {
              const selectDeliveryOption = deliveryOptions.find(
                (option) => option.id === item.deliveryOptionId
              );

              return (
                <div key={item.id} className="cart-item-container">
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
                        <span className="update-quantity-link link-primary">Update</span>
                        <span className="delete-quantity-link link-primary">Delete</span>
                      </div>
                    </div>

                    <div className="delivery-options">
                      <div className="delivery-options-title">Choose a delivery option:</div>

                      {deliveryOptions.map((option) => (
                        <div key={option.id} className="delivery-option">
                          <input
                            type="radio"
                            checked={option.id === item.deliveryOptionId}
                            className="delivery-option-input"
                            name={`delivery-option-${item.productId || item.id}`}
                            readOnly
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

            <button className="place-order-button button-primary">Place your order</button>
          </div>
        </div>
      </div>
    </>
  );
}