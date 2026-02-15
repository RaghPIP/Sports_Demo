import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/cart/add`, {
        userId,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        size: selectedSize,
        image: product.image
      });
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  if (!product) {
    return <div className="p-24 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter cursor-pointer" 
            style={{fontFamily: 'Oswald, sans-serif'}}
            onClick={() => navigate('/home')}
            data-testid="logo"
          >
            VELOCITY
          </h1>
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 hover:bg-gray-100"
            data-testid="cart-icon-btn"
          >
            <ShoppingCart size={24} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 mb-8 hover:underline"
          data-testid="back-btn"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-gray-50 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <img
                src={product.image}
                alt="Thumbnail 1"
                className="aspect-square object-cover cursor-pointer border-2 border-black"
                data-testid="product-thumbnail-1"
              />
              <img
                src={product.thumbnail}
                alt="Thumbnail 2"
                className="aspect-square object-cover cursor-pointer"
                data-testid="product-thumbnail-2"
              />
              <img
                src={product.image}
                alt="Thumbnail 3"
                className="aspect-square object-cover cursor-pointer"
                data-testid="product-thumbnail-3"
              />
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4" style={{fontFamily: 'Oswald, sans-serif'}} data-testid="product-title">
              {product.name}
            </h2>
            <p className="text-3xl font-bold mb-6" data-testid="product-price">${product.price}</p>
            <p className="text-gray-600 mb-8 leading-relaxed" data-testid="product-description">
              {product.description}
            </p>

            <div className="mb-8">
              <label className="block font-bold uppercase text-sm mb-3">Select Size</label>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border-2 border-black px-6 py-3 font-bold uppercase hover:bg-black hover:text-white transition-colors`}
                    data-testid={`size-btn-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="mt-2 text-sm text-gray-600">Selected: {selectedSize}</p>
              )}
            </div>

            <div className="mb-8">
              <label className="block font-bold uppercase text-sm mb-3">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border-2 border-black px-4 py-3 w-24 font-bold"
                data-testid="quantity-input"
                min="-999"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white uppercase font-bold px-12 py-4 tracking-widest hover:bg-zinc-800 transition-colors"
              data-testid="add-to-cart-btn"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}