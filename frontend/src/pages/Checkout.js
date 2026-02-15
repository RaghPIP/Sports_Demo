import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [billingInfo, setBillingInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const cartResponse = await axios.get(`${BACKEND_URL}/api/cart/${userId}`);
      const cartItems = cartResponse.data;
      
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 10;
      
      await axios.post(`${BACKEND_URL}/api/orders`, {
        userId,
        items: cartItems,
        total,
        shippingInfo,
        paymentInfo: billingInfo
      });
      
      toast.success('Order placed successfully!');
      navigate('/home');
    } catch (error) {
      toast.error('Error placing order');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter cursor-pointer" 
            style={{fontFamily: 'Oswald, sans-serif'}}
            onClick={() => navigate('/home')}
            data-testid="logo"
          >
            VELOCITY
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 mb-8 hover:underline"
          data-testid="back-to-cart-btn"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </button>

        <h2 className="text-4xl md:text-5xl font-black uppercase mb-8" style={{fontFamily: 'Oswald, sans-serif'}} data-testid="checkout-title">
          Checkout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8" data-testid="checkout-form">
          <div className="border border-gray-200 p-6">
            <h3 className="font-bold uppercase text-xl mb-6">Shipping Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Full Name"
                value={shippingInfo.fullName}
                onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                className="border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                required
                data-testid="shipping-fullname-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                className="border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                required
                data-testid="shipping-email-input"
              />
              <input
                type="text"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                className="md:col-span-2 border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                required
                data-testid="shipping-address-input"
              />
              <input
                type="text"
                placeholder="City"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                className="border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                required
                data-testid="shipping-city-input"
              />
              <input
                type="text"
                placeholder="State"
                value={shippingInfo.state}
                onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                className="border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                required
                data-testid="shipping-state-input"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={shippingInfo.zipCode}
                onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                className="border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                required
                data-testid="shipping-zipcode-input"
              />
            </div>
          </div>

          <div className="border border-gray-200 p-6">
            <h3 className="font-bold uppercase text-xl mb-6">Payment Information</h3>
            
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  className="w-5 h-5"
                  data-testid="billing-same-checkbox"
                />
                <span className="text-sm">Billing same as shipping</span>
              </label>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                placeholder="Card Number"
                value={billingInfo.cardNumber}
                onChange={(e) => setBillingInfo({...billingInfo, cardNumber: e.target.value})}
                className="w-full border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                required
                data-testid="card-number-input"
              />
              <div className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={billingInfo.expiryDate}
                  onChange={(e) => setBillingInfo({...billingInfo, expiryDate: e.target.value})}
                  className="border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                  required
                  data-testid="card-expiry-input"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={billingInfo.cvv}
                  onChange={(e) => setBillingInfo({...billingInfo, cvv: e.target.value})}
                  className="border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                  required
                  data-testid="card-cvv-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white uppercase font-bold px-12 py-4 tracking-widest hover:bg-zinc-800"
            data-testid="place-order-btn"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}