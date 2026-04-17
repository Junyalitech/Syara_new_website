import React, { useState } from 'react'
import DeliveryInfo from '../components/Checkout/DeliveryInfo'
import ReviewItems from '../components/Checkout/ReviewItems'
import OrderSummary from '../components/Checkout/OrderSummary'
import '../components/Checkout/checkout.css'

const CheckoutPage = () => {
    const [pincode, setPincode] = useState("");
    const [checkoutAddress,setCheckoutAddress] = useState("")

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div>
                    <DeliveryInfo setPincode={setPincode} setCheckoutAddress={setCheckoutAddress}/>
                    <div style={{ height: 20 }} />
                    <ReviewItems />
                </div>
                <OrderSummary pincode={pincode} checkoutAddress={checkoutAddress}/>
            </div>
        </div>
    )
}

export default CheckoutPage