import React from 'react'
import DeliveryInfo from '../components/Checkout/DeliveryInfo'
import ReviewItems from '../components/Checkout/ReviewItems'
import OrderSummary from '../components/Checkout/OrderSummary'
import '../components/Checkout/checkout.css'

const CheckoutPage = () => {
    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div>
                    <DeliveryInfo />
                    <div style={{ height: 20 }} />
                    <ReviewItems />
                </div>
                <OrderSummary />
            </div>
        </div>
    )
}

export default CheckoutPage