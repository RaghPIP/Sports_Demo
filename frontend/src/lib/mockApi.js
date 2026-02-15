const USERS = [
  { id: 'user1', username: 'user1', password: 'user@1' },
  { id: 'user2', username: 'user2', password: 'user@2' },
  { id: 'user3', username: 'user3', password: 'user@3' },
  { id: 'user4', username: 'user4', password: 'user@4' },
  { id: 'user5', username: 'user5', password: 'user@5' }
];

const PRODUCTS = [
  {
    id: 'prod1',
    name: 'Air Zoom Pegasus',
    price: 120,
    category: 'men',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
    description: 'Premium running shoes with responsive cushioning',
    sizes: ['7', '8', '9', '10', '11']
  },
  {
    id: 'prod2',
    name: 'React Infinity',
    price: 160,
    category: 'women',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200',
    description: 'Designed for long-distance comfort',
    sizes: ['6', '7', '8', '9', '10']
  },
  {
    id: 'prod3',
    name: 'Dri-FIT Training Shirt',
    price: 35,
    category: 'men',
    image: 'https://images.unsplash.com/photo-1618354691714-7d92150909db?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1618354691714-7d92150909db?w=200',
    description: 'Moisture-wicking performance tee',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'prod4',
    name: 'Pro Compression Tights',
    price: 65,
    category: 'women',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200',
    description: 'High-performance compression fit',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'prod5',
    name: 'Court Vision Basketball',
    price: 85,
    category: 'men',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200',
    description: 'Classic basketball sneakers',
    sizes: ['8', '9', '10', '11', '12']
  },
  {
    id: 'prod6',
    name: 'Windrunner Jacket',
    price: 100,
    category: 'women',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200',
    description: 'Lightweight weather-resistant jacket',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
];

const CART_PREFIX = 'velocity_cart_';
const ORDERS_KEY = 'velocity_orders';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

const readJson = (key, fallback) => {
  const storage = getStorage();
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeJson = (key, value) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const getCartKey = (userId) => `${CART_PREFIX}${userId}`;

export const login = async (username, password) => {
  await delay();
  const normalizedUsername = username.trim();
  const user = USERS.find(
    (item) => item.username === normalizedUsername && item.password === password
  );

  if (!user) {
    return { success: false, message: 'Invalid credentials' };
  }

  return {
    success: true,
    userId: user.id,
    username: user.username,
    message: 'Login successful'
  };
};

export const getProducts = async ({ category = 'all', search = '', sort = '' } = {}) => {
  await delay();
  let results = [...PRODUCTS];

  if (category && category !== 'all') {
    results = results.filter((product) => product.category === category);
  }

  if (search) {
    const query = search.trim().toLowerCase();
    results = results.filter((product) => product.name.toLowerCase().includes(query));
  }

  if (sort === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  }

  if (sort === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  }

  return results;
};

export const getProductById = async (productId) => {
  await delay();
  return PRODUCTS.find((product) => product.id === productId) || null;
};

export const getCart = async (userId) => {
  await delay();
  if (!userId) return [];
  return readJson(getCartKey(userId), []);
};

export const addToCart = async (userId, item) => {
  await delay();
  if (!userId) return [];
  const key = getCartKey(userId);
  const cart = readJson(key, []);
  const existing = cart.find(
    (cartItem) => cartItem.productId === item.productId && cartItem.size === item.size
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({
      id: createId(),
      userId,
      ...item
    });
  }

  writeJson(key, cart);
  return cart;
};

export const updateCartItem = async (userId, itemId, quantity) => {
  await delay();
  if (!userId) return [];
  const key = getCartKey(userId);
  const cart = readJson(key, []);
  const updatedCart = cart
    .map((item) => (item.id === itemId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  writeJson(key, updatedCart);
  return updatedCart;
};

export const removeCartItem = async (userId, itemId) => {
  await delay();
  if (!userId) return [];
  const key = getCartKey(userId);
  const cart = readJson(key, []);
  const updatedCart = cart.filter((item) => item.id !== itemId);
  writeJson(key, updatedCart);
  return updatedCart;
};

export const clearCart = async (userId) => {
  await delay();
  if (!userId) return [];
  writeJson(getCartKey(userId), []);
  return [];
};

export const createOrder = async ({ userId, items, total, shippingInfo, paymentInfo }) => {
  await delay();
  const orders = readJson(ORDERS_KEY, []);
  const order = {
    id: createId(),
    userId,
    items,
    total,
    shippingInfo,
    paymentInfo,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  writeJson(ORDERS_KEY, orders);
  return order;
};
