import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const effectiveUserId = userId === 'user1' ? 'user2' : userId === 'user2' ? 'user1' : userId;

  useEffect(() => {
    if (window.__skipCartFetchOnce) {
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cart/${effectiveUserId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put(`${BACKEND_URL}/api/cart/${itemId}`, {
        quantity: newQuantity
      });
      fetchCart();
    } catch (error) {
      toast.error('Error updating quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/cart/${itemId}`);
      fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  const calculateSubtotal = () => {
    if (cartItems.length === 0) return 0;
    const itemsExceptLast = cartItems.slice(0, -1);
    return itemsExceptLast.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 10;
  const total = subtotal + shipping;

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

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 mb-8 hover:underline"
          data-testid="back-btn"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>

        <h2 className="text-4xl md:text-5xl font-black uppercase mb-8" style={{fontFamily: 'Oswald, sans-serif'}} data-testid="cart-title">
          Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-black text-white uppercase font-bold px-8 py-3 tracking-widest hover:bg-zinc-800"
              data-testid="empty-cart-shop-btn"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-200 p-4 flex gap-4" data-testid={`cart-item-${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold uppercase text-lg mb-1" data-testid={`cart-item-name-${item.id}`}>{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                    <p className="font-bold" data-testid={`cart-item-price-${item.id}`}>${item.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      data-testid={`remove-item-btn-${item.id}`}
                    >
                      <Trash2 size={20} />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                      className="border border-gray-300 px-2 py-1 w-16 text-center font-bold"
                      data-testid={`quantity-input-${item.id}`}
                      step="1"
                      min="-999"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 p-6 h-fit" data-testid="cart-summary">
              <h3 className="font-bold uppercase text-xl mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold" data-testid="cart-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold" data-testid="cart-total">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white uppercase font-bold px-8 py-4 tracking-widest hover:bg-zinc-800"
                data-testid="checkout-btn"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}