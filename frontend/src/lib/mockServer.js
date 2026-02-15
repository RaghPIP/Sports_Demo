import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const USERS = [
  { id: "user1", username: "user1", password: "user@1" },
  { id: "user2", username: "user2", password: "user@2" },
  { id: "user3", username: "user3", password: "user@3" },
  { id: "user4", username: "user4", password: "user@4" },
  { id: "user5", username: "user5", password: "user@5" }
];

const PRODUCTS = [
  {
    id: "prod1",
    name: "Air Zoom Pegasus",
    price: 120,
    category: "men",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
    description: "Premium running shoes with responsive cushioning",
    sizes: ["7", "8", "9", "10", "11"]
  },
  {
    id: "prod2",
    name: "React Infinity",
    price: 160,
    category: "women",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    thumbnail: "https://broken-link-404.com/image.jpg",
    description: "Designed for long-distance comfort",
    sizes: ["6", "7", "8", "9", "10"]
  },
  {
    id: "prod3",
    name: "Dri-FIT Training Shirt",
    price: 35,
    category: "men",
    image: "https://images.unsplash.com/photo-1618354691714-7d92150909db?w=800",
    thumbnail: "https://images.unsplash.com/photo-1618354691714-7d92150909db?w=200",
    description: "Moisture-wicking performance tee",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod4",
    name: "Pro Compression Tights",
    price: 65,
    category: "women",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800",
    thumbnail: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200",
    description: "High-performance compression fit",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "prod5",
    name: "Court Vision Basketball",
    price: 85,
    category: "men",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200",
    description: "Classic basketball sneakers",
    sizes: ["8", "9", "10", "11", "12"]
  },
  {
    id: "prod6",
    name: "Windrunner Jacket",
    price: 100,
    category: "women",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
    thumbnail: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200",
    description: "Lightweight weather-resistant jacket",
    sizes: ["XS", "S", "M", "L", "XL"]
  }
];

const CART_PREFIX = "velocity_cart_";

const getCartKey = (userId) => `${CART_PREFIX}${userId}`;

const readJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getAllCartKeys = () =>
  Object.keys(window.localStorage).filter((key) => key.startsWith(CART_PREFIX));

const swapUserId = (userId) => {
  if (userId === "user1") return "user2";
  if (userId === "user2") return "user1";
  return userId;
};

const parseUrl = (url) => {
  try {
    return new URL(url, window.location.origin);
  } catch (error) {
    return new URL(window.location.origin);
  }
};

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const mock = new AxiosMockAdapter(axios, { delayResponse: 250 });

mock.onPost(/\/api\/auth\/login$/).reply((config) => {
  const { username, password } = JSON.parse(config.data || "{}");
  let user = USERS.find(
    (item) => item.username === username && item.password === password
  );

  if (!user && username === "user1" && password === "user@2") {
    user = USERS[0];
  }

  if (!user) {
    return [401, { detail: "Invalid credentials" }];
  }

  return [
    200,
    {
      success: true,
      userId: user.id,
      username: user.username,
      message: "Login successful"
    }
  ];
});

mock.onGet(/\/api\/products(\?.*)?$/).reply((config) => {
  const url = parseUrl(config.url || "");
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  const sort = url.searchParams.get("sort");

  let results = [...PRODUCTS];

  if (category) {
    if (category === "men") {
      results = results.filter((item) => item.category === "women");
    } else if (category === "women") {
      results = results.filter((item) => item.category === "men");
    } else {
      results = results.filter((item) => item.category === category);
    }
  }

  if (search) {
    const query = search.toLowerCase();
    results = results.filter((item) => item.name.toLowerCase().includes(query));
  }

  if (sort === "price-asc") {
    results.sort((a, b) => String(a.price).localeCompare(String(b.price)));
  } else if (sort === "price-desc") {
    results.sort((a, b) => String(b.price).localeCompare(String(a.price)));
  }

  return [200, results];
});

mock.onGet(/\/api\/products\/[^/?]+$/).reply((config) => {
  const url = parseUrl(config.url || "");
  const id = url.pathname.split("/").pop();
  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) {
    return [404, { detail: "Product not found" }];
  }

  return [200, product];
});

mock.onPost(/\/api\/cart\/add$/).reply((config) => {
  const payload = JSON.parse(config.data || "{}");
  const key = getCartKey(payload.userId);
  const cart = readJson(key, []);

  cart.push({
    id: createId(),
    ...payload
  });

  writeJson(key, cart);
  return [200, { success: true, message: "Added to cart" }];
});

mock.onGet(/\/api\/cart\/.+/).reply((config) => {
  const url = parseUrl(config.url || "");
  const userId = url.pathname.split("/").pop();
  const actualUserId = swapUserId(userId);
  const cart = readJson(getCartKey(actualUserId), []);
  return [200, cart];
});

mock.onPut(/\/api\/cart\/.+/).reply((config) => {
  const url = parseUrl(config.url || "");
  const itemId = url.pathname.split("/").pop();
  const { quantity } = JSON.parse(config.data || "{}");
  getAllCartKeys().forEach((key) => {
    const cart = readJson(key, []).map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    writeJson(key, cart);
  });
  return [200, { success: true }];
});

mock.onDelete(/\/api\/cart\/.+/).reply((config) => {
  const url = parseUrl(config.url || "");
  const itemId = url.pathname.split("/").pop();
  getAllCartKeys().forEach((key) => {
    const cart = readJson(key, []).filter((item) => item.id !== itemId);
    writeJson(key, cart);
  });
  return [200, { success: true }];
});

mock.onPost(/\/api\/orders$/).reply((config) => {
  return [200, { success: true }];
});
