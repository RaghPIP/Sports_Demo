import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
    fetchProducts();
    fetchCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cart/${userId}`);
      setCartCount(response.data.length);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleCategoryFilter = async (cat) => {
    setCategory(cat);
    try {
      const url = cat === 'all' 
        ? `${BACKEND_URL}/api/products`
        : `${BACKEND_URL}/api/products?category=${cat}`;
      const response = await axios.get(url);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error filtering products:', error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      window.location.reload();
    }
  };

  const handleSort = async (sortType) => {
    setSortBy(sortType);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products?sort=${sortType}`);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error sorting products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40" data-testid="header">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter cursor-pointer" 
            style={{fontFamily: 'Oswald, sans-serif'}}
            onClick={() => navigate('/home')}
            data-testid="logo"
          >
            VELOCITY
          </h1>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleCategoryFilter('all')}
              className={`font-bold uppercase text-sm ${category === 'all' ? 'border-b-2 border-black' : ''}`}
              data-testid="filter-all-btn"
            >
              All
            </button>
            <button
              onClick={() => handleCategoryFilter('men')}
              className={`font-bold uppercase text-sm ${category === 'men' ? 'border-b-2 border-black' : ''}`}
              data-testid="filter-men-btn"
            >
              Men
            </button>
            <button
              onClick={() => handleCategoryFilter('women')}
              className={`font-bold uppercase text-sm ${category === 'women' ? 'border-b-2 border-black' : ''}`}
              data-testid="filter-women-btn"
            >
              Women
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100"
              data-testid="profile-icon-btn"
            >
              <User size={24} />
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-100"
              data-testid="cart-icon-btn"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D0FF00] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count-badge">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              data-testid="mobile-menu-btn"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-50" data-testid="mobile-menu">
            <div className="p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 -z-10"
                data-testid="mobile-menu-close-btn"
              >
                <X size={24} />
              </button>
              <div className="mt-16 space-y-6">
                <button
                  onClick={() => {
                    handleCategoryFilter('all');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left font-bold uppercase text-2xl"
                  data-testid="mobile-filter-all"
                >
                  All
                </button>
                <button
                  onClick={() => {
                    handleCategoryFilter('men');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left font-bold uppercase text-2xl"
                  data-testid="mobile-filter-men"
                >
                  Men
                </button>
                <button
                  onClick={() => {
                    handleCategoryFilter('women');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left font-bold uppercase text-2xl"
                  data-testid="mobile-filter-women"
                >
                  Women
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="relative h-[600px] bg-black overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1723186051179-69b1dfe2a1f9?w=1600"
          alt="Hero"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 relative z-10" style={{fontFamily: 'Oswald, sans-serif'}} data-testid="hero-title">
            UNLEASH YOUR POWER
          </h2>
          <button
            onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#D0FF00] text-black uppercase font-bold px-12 py-4 tracking-widest hover:bg-[#B3DB00] relative z-0"
            data-testid="hero-cta-btn"
          >
            Shop Now
          </button>
        </div>
        <div className="absolute inset-0 bg-transparent z-5 pointer-events-auto"></div>
      </section>

      <section id="products-section" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h3 className="text-4xl md:text-5xl font-black uppercase" style={{fontFamily: 'Oswald, sans-serif'}} data-testid="products-title">
            Featured Products
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full border border-gray-300 px-10 py-2 focus:outline-none focus:border-black"
                data-testid="search-input"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="border border-gray-300 px-4 py-2 font-bold uppercase text-sm focus:outline-none focus:border-black"
              data-testid="sort-select"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" data-testid="product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group relative bg-gray-50 aspect-[3/4] overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
              data-testid={`product-card-${product.id}`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                <h4 className="font-bold uppercase text-lg mb-1" data-testid={`product-name-${product.id}`}>{product.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="font-bold text-xl" data-testid={`product-price-${product.id}`}>${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-black text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="font-bold uppercase text-lg mb-4">About</h5>
              <p className="text-gray-400 text-sm">Premium athletic gear for champions</p>
            </div>
            <div>
              <h5 className="font-bold uppercase text-lg mb-4">Support</h5>
              <a href="/returns" className="block text-gray-400 hover:text-white text-sm mb-2" data-testid="footer-returns-link">
                Returns & Exchanges
              </a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm">Contact Us</a>
            </div>
            <div>
              <h5 className="font-bold uppercase text-lg mb-4">Follow Us</h5>
              <p className="text-gray-400 text-sm">Instagram | Twitter | Facebook</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}