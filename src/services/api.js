const API_BASE = 'http://localhost:5001';
const FIGURES_URL = `${API_BASE}/figures`;
const USERS_URL = `${API_BASE}/users`;
const ORDERS_URL = `${API_BASE}/orders`;

const FIGURES_KEY = 'game_figures_db';
const USERS_KEY = 'game_figures_users';
const ORDERS_KEY = 'game_figures_orders';

// ─── Fallback data ───────────────────────────────────────────────────────────

const initialFigures = [
  { id: "1", name: "Malenia, Blade of Miquella 1/7 Scale Figure", gameSeries: "Elden Ring", category: "Statue", price: 10500000, image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80", description: "Mô hình cao cấp tái hiện hoàn hảo Malenia.", manufacturer: "PureArts", scale: "1/7", height: "38 cm", stock: 5, rating: 4.9, isDeleted: false },
  { id: "2", name: "Raiden Shogun - Plane of Euthymia 1/7", gameSeries: "Genshin Impact", category: "Scale Figure", price: 4800000, image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80", description: "Lôi Thần Raiden Shogun kiêu hãnh.", manufacturer: "miHoYo Official", scale: "1/7", height: "27 cm", stock: 12, rating: 4.8, isDeleted: false },
  { id: "3", name: "Ahri K/DA All Out Special Edition", gameSeries: "League of Legends", category: "Statue", price: 6200000, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80", description: "Cửu Vĩ Yêu Hồ Ahri.", manufacturer: "Apex Innovation", scale: "1/7", height: "29 cm", stock: 8, rating: 4.9, isDeleted: false },
  { id: "4", name: "2B (YoRHa No. 2 Type B) DX Version", gameSeries: "NieR:Automata", category: "Scale Figure", price: 5500000, image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80", description: "Phiên bản DX đầy đủ phụ kiện.", manufacturer: "Square Enix / Flare", scale: "Non-scale", height: "28 cm", stock: 15, rating: 4.7, isDeleted: false },
  { id: "5", name: "Cloud Strife & Hardy-Daytona Play Arts Kai", gameSeries: "Final Fantasy VII", category: "Action Figure", price: 8900000, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80", description: "Bộ mô hình khớp chuyển động.", manufacturer: "Square Enix", scale: "Action Figure", height: "26 cm", stock: 4, rating: 5.0, isDeleted: false },
  { id: "6", name: "Nendoroid Jinx #1600", gameSeries: "League of Legends", category: "Nendoroid", price: 1350000, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", description: "Nendoroid Jinx ngổ ngáo.", manufacturer: "Good Smile Company", scale: "Nendoroid", height: "10 cm", stock: 20, rating: 4.6, isDeleted: false },
  { id: "7", name: "Nendoroid Zhongli #2100", gameSeries: "Genshin Impact", category: "Nendoroid", price: 1450000, image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80", description: "Nham Thần Zhongli phong thái.", manufacturer: "Good Smile Company", scale: "Nendoroid", height: "10 cm", stock: 18, rating: 4.9, isDeleted: false },
  { id: "8", name: "Figma Johnny Silverhand", gameSeries: "Cyberpunk 2077", category: "Figma", price: 2200000, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80", description: "Mô hình Figma khớp cử động.", manufacturer: "Max Factory", scale: "Figma", height: "16 cm", stock: 9, rating: 4.5, isDeleted: false }
];

const initialUsers = [
  { id: "1", username: "admin", password: "123", role: "admin", displayName: "Quản Trị Viên", email: "admin@figurehub.vn" },
  { id: "2", username: "customer", password: "123", role: "customer", displayName: "Khách Hàng Demo", email: "customer@figurehub.vn" }
];

// ─── LocalStorage helpers ────────────────────────────────────────────────────

const getLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize localStorage if empty
const initLocalStorage = () => {
  if (!localStorage.getItem(FIGURES_KEY)) setLocal(FIGURES_KEY, initialFigures);
  if (!localStorage.getItem(USERS_KEY)) setLocal(USERS_KEY, initialUsers);
  if (!localStorage.getItem(ORDERS_KEY)) setLocal(ORDERS_KEY, []);
};
initLocalStorage();

// ─── Figures API ─────────────────────────────────────────────────────────────

export const api = {
  async getFigures() {
    try {
      const res = await fetch(FIGURES_URL);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      // Only return non-deleted figures
      const active = data.filter(f => !f.isDeleted);
      setLocal(FIGURES_KEY, data); // cache all (including deleted) for fallback
      return active;
    } catch {
      console.warn('API server unreachable, using LocalStorage fallback');
      return getLocal(FIGURES_KEY, initialFigures).filter(f => !f.isDeleted);
    }
  },

  async getFigureById(id) {
    try {
      const res = await fetch(`${FIGURES_URL}/${id}`);
      if (!res.ok) throw new Error('Not found');
      return await res.json();
    } catch {
      const list = getLocal(FIGURES_KEY, initialFigures);
      return list.find(item => String(item.id) === String(id)) || null;
    }
  },

  async addFigure(figureData) {
    const newItem = {
      ...figureData,
      id: Date.now().toString(),
      price: Number(figureData.price),
      stock: Number(figureData.stock || 10),
      rating: Number(figureData.rating || 5.0),
      isDeleted: false
    };
    try {
      const res = await fetch(FIGURES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        const data = await res.json();
        const local = getLocal(FIGURES_KEY, []);
        setLocal(FIGURES_KEY, [...local, data]);
        return data;
      }
    } catch {
      console.warn('API error, saving to LocalStorage');
    }
    const local = getLocal(FIGURES_KEY, []);
    setLocal(FIGURES_KEY, [newItem, ...local]);
    return newItem;
  },

  async updateFigure(id, figureData) {
    const formattedData = {
      ...figureData,
      price: Number(figureData.price),
      stock: Number(figureData.stock)
    };
    try {
      const res = await fetch(`${FIGURES_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      });
      if (res.ok) {
        const data = await res.json();
        const local = getLocal(FIGURES_KEY, []);
        setLocal(FIGURES_KEY, local.map(item => String(item.id) === String(id) ? data : item));
        return data;
      }
    } catch {
      console.warn('API error, updating LocalStorage');
    }
    const local = getLocal(FIGURES_KEY, []);
    const updated = { ...local.find(i => String(i.id) === String(id)), ...formattedData, id };
    setLocal(FIGURES_KEY, local.map(item => String(item.id) === String(id) ? updated : item));
    return updated;
  },

  // Soft delete: set isDeleted = true
  async deleteFigure(id) {
    try {
      // First get current data, then PATCH isDeleted
      const getRes = await fetch(`${FIGURES_URL}/${id}`);
      if (getRes.ok) {
        const current = await getRes.json();
        const res = await fetch(`${FIGURES_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...current, isDeleted: true })
        });
        if (res.ok) {
          const local = getLocal(FIGURES_KEY, []);
          setLocal(FIGURES_KEY, local.map(item =>
            String(item.id) === String(id) ? { ...item, isDeleted: true } : item
          ));
          return true;
        }
      }
    } catch {
      console.warn('API error, soft-deleting in LocalStorage');
    }
    const local = getLocal(FIGURES_KEY, []);
    setLocal(FIGURES_KEY, local.map(item =>
      String(item.id) === String(id) ? { ...item, isDeleted: true } : item
    ));
    return true;
  },

  // Update stock after checkout
  async updateFigureStock(id, newStock) {
    try {
      const getRes = await fetch(`${FIGURES_URL}/${id}`);
      if (getRes.ok) {
        const current = await getRes.json();
        const res = await fetch(`${FIGURES_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...current, stock: newStock })
        });
        if (res.ok) {
          const local = getLocal(FIGURES_KEY, []);
          setLocal(FIGURES_KEY, local.map(item =>
            String(item.id) === String(id) ? { ...item, stock: newStock } : item
          ));
          return true;
        }
      }
    } catch {
      console.warn('API error, updating stock in LocalStorage');
    }
    const local = getLocal(FIGURES_KEY, []);
    setLocal(FIGURES_KEY, local.map(item =>
      String(item.id) === String(id) ? { ...item, stock: newStock } : item
    ));
    return true;
  },

  // ─── Users API ─────────────────────────────────────────────────────────────

  async loginUser(username, password) {
    const normalized = username.trim().toLowerCase();
    try {
      const res = await fetch(`${USERS_URL}?username=${normalized}`);
      if (res.ok) {
        const users = await res.json();
        const found = users.find(u => u.username === normalized && u.password === password);
        if (found) {
          return { success: true, user: { id: found.id, username: found.username, role: found.role, displayName: found.displayName } };
        }
        return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' };
      }
    } catch {
      console.warn('API error, using LocalStorage users fallback');
    }
    // Fallback: localStorage
    const users = getLocal(USERS_KEY, initialUsers);
    const found = users.find(u => u.username === normalized && u.password === password);
    if (found) {
      return { success: true, user: { id: found.id, username: found.username, role: found.role, displayName: found.displayName } };
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' };
  },

  // ─── Orders API ────────────────────────────────────────────────────────────

  async getOrders() {
    try {
      const res = await fetch(ORDERS_URL);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setLocal(ORDERS_KEY, data);
      return data.filter(o => !o.isDeleted);
    } catch {
      console.warn('API error, using LocalStorage orders');
      return getLocal(ORDERS_KEY, []).filter(o => !o.isDeleted);
    }
  },

  async getOrdersByUser(username) {
    try {
      const res = await fetch(`${ORDERS_URL}?username=${username}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return data.filter(o => !o.isDeleted);
    } catch {
      console.warn('API error, using LocalStorage orders');
      return getLocal(ORDERS_KEY, []).filter(o => o.username === username && !o.isDeleted);
    }
  },

  async createOrder(orderData) {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isDeleted: false
    };
    try {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        const data = await res.json();
        const local = getLocal(ORDERS_KEY, []);
        setLocal(ORDERS_KEY, [...local, data]);
        return data;
      }
    } catch {
      console.warn('API error, saving order to LocalStorage');
    }
    const local = getLocal(ORDERS_KEY, []);
    setLocal(ORDERS_KEY, [...local, newOrder]);
    return newOrder;
  },

  async softDeleteOrder(id) {
    try {
      const getRes = await fetch(`${ORDERS_URL}/${id}`);
      if (getRes.ok) {
        const current = await getRes.json();
        const res = await fetch(`${ORDERS_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...current, isDeleted: true })
        });
        if (res.ok) {
          const local = getLocal(ORDERS_KEY, []);
          setLocal(ORDERS_KEY, local.map(o =>
            String(o.id) === String(id) ? { ...o, isDeleted: true } : o
          ));
          return true;
        }
      }
    } catch {
      console.warn('API error, soft-deleting order in LocalStorage');
    }
    const local = getLocal(ORDERS_KEY, []);
    setLocal(ORDERS_KEY, local.map(o =>
      String(o.id) === String(id) ? { ...o, isDeleted: true } : o
    ));
    return true;
  }
};
