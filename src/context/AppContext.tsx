import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  User,
  Pizza,
  Order,
  OrderItem,
  OrderStatus,
  AppNotification
} from '../types';
import { INITIAL_PIZZAS, INITIAL_ORDERS, INITIAL_USERS } from '../data/initialData';
import { playOrderNotificationSound } from '../utils/audio';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: 'customer' | 'admin') => void;
  registeredUsers: User[];
  loginUser: (email: string) => { success: boolean; message?: string };
  registerUser: (userData: Omit<User, 'id' | 'loyaltyPoints'>) => { success: boolean; user?: User; message?: string };
  logoutUser: () => void;
  
  // Pizza CRUD
  pizzas: Pizza[];
  addPizza: (pizza: Omit<Pizza, 'id'>) => void;
  updatePizza: (id: string, updated: Partial<Pizza>) => void;
  deletePizza: (id: string) => void;
  togglePizzaStock: (id: string) => void;
  
  // Orders & Realtime
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  clearOrderHistory: (customerId?: string) => void;
  
  // Cart
  cart: OrderItem[];
  addToCart: (item: Omit<OrderItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  
  // Notifications
  notifications: AppNotification[];
  markNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  latestOrderAlert: Order | null;
  dismissOrderAlert: () => void;
  latestCustomerStatusAlert: { id: string; orderId: string; orderNumber: string; status: OrderStatus; timestamp: string } | null;
  dismissCustomerStatusAlert: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BROADCAST_CHANNEL_NAME = 'pizzeria_roma_realtime_channel';
const TAB_ID = Math.random().toString(36).substring(2);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('pizzeria_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pizzeria_lang', lang);
  };

  // 2. Dark Mode theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pizzeria_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('pizzeria_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 3. User Authentication & Role
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pizzeria_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [INITIAL_USERS.customer, INITIAL_USERS.admin];
  });

  useEffect(() => {
    localStorage.setItem('pizzeria_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('pizzeria_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'staff') parsed.role = 'admin'; // Migrate legacy staff role
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS.customer;
  });

  const switchRole = (role: 'customer' | 'admin') => {
    const user = INITIAL_USERS[role] || INITIAL_USERS.customer;
    setCurrentUser(user);
    localStorage.setItem('pizzeria_user', JSON.stringify(user));
  };

  const loginUser = (email: string) => {
    const normalized = email.trim().toLowerCase();
    const found = registeredUsers.find((u) => u.email.trim().toLowerCase() === normalized);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('pizzeria_user', JSON.stringify(found));
      return { success: true };
    }
    // Check initial demo users by role fallback or email
    const demoUser = Object.values(INITIAL_USERS).find(
      (u) => u.email.trim().toLowerCase() === normalized
    );
    if (demoUser) {
      setCurrentUser(demoUser);
      localStorage.setItem('pizzeria_user', JSON.stringify(demoUser));
      return { success: true };
    }
    return { success: false, message: 'Account not found with this email. Please sign up.' };
  };

  const registerUser = (userData: Omit<User, 'id' | 'loyaltyPoints'>) => {
    const existing = registeredUsers.some(
      (u) => u.email.trim().toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      ...userData,
      id: 'usr-' + Date.now(),
      loyaltyPoints: 50 // Welcome bonus points
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('pizzeria_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logoutUser = () => {
    // Reset to customer demo user
    setCurrentUser(INITIAL_USERS.customer);
    localStorage.setItem('pizzeria_user', JSON.stringify(INITIAL_USERS.customer));
  };

  // 4. Pizza Menu (CRUD State)
  const [pizzas, setPizzas] = useState<Pizza[]>(() => {
    const saved = localStorage.getItem('pizzeria_menu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PIZZAS;
  });

  useEffect(() => {
    localStorage.setItem('pizzeria_menu', JSON.stringify(pizzas));
  }, [pizzas]);

  const addPizza = (pizzaData: Omit<Pizza, 'id'>) => {
    const newPizza: Pizza = {
      ...pizzaData,
      id: 'pizza-' + Date.now()
    };
    setPizzas((prev) => [newPizza, ...prev]);
  };

  const updatePizza = (id: string, updated: Partial<Pizza>) => {
    setPizzas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deletePizza = (id: string) => {
    setPizzas((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePizzaStock = (id: string) => {
    setPizzas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // 5. Orders & Real-time Broadcast
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pizzeria_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          return parsed.filter((o) => {
            if (!o || !o.id || seen.has(o.id)) return false;
            seen.add(o.id);
            return true;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    // Save deduplicated orders to localStorage
    const seen = new Set<string>();
    const uniqueOrders = orders.filter((o) => {
      if (!o || !o.id || seen.has(o.id)) return false;
      seen.add(o.id);
      return true;
    });
    localStorage.setItem('pizzeria_orders', JSON.stringify(uniqueOrders));
  }, [orders]);

  // Notifications & Banner Alert
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('pizzeria_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'notif-welcome',
        title: {
          en: 'Welcome to Pizzeria Roma!',
          ja: 'Pizzeria Romaへようこそ！'
        },
        message: {
          en: 'Order fresh authentic wood-fired pizzas with real-time live order tracking.',
          ja: '本格薪窯ピザをリアルタイム調理進行機能でお楽しみください。'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'system'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pizzeria_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [latestOrderAlert, setLatestOrderAlert] = useState<Order | null>(null);
  const [latestCustomerStatusAlert, setLatestCustomerStatusAlert] = useState<{
    id: string;
    orderId: string;
    orderNumber: string;
    status: OrderStatus;
    timestamp: string;
  } | null>(null);

  const dismissOrderAlert = () => setLatestOrderAlert(null);
  const dismissCustomerStatusAlert = () => setLatestCustomerStatusAlert(null);

  const createStatusNotification = (orderNumber: string, status: OrderStatus, orderId: string): AppNotification => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    switch (status) {
      case 'received':
        return {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: { en: 'Shop Received Your Order!', ja: '店舗が注文を受領しました！' },
          message: {
            en: `Order #${orderNumber} confirmed and queued in the kitchen.`,
            ja: `注文番号 #${orderNumber} が厨房で確認されました。`
          },
          timestamp: time,
          read: false,
          type: 'status_change',
          orderId
        };
      case 'preparing':
        return {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: { en: 'Kitchen Preparing Ingredients', ja: '生地・トッピング仕込み中' },
          message: {
            en: `Order #${orderNumber} dough is being stretched and topped with fresh ingredients.`,
            ja: `注文番号 #${orderNumber} の生地・トッピングを仕込み中です。`
          },
          timestamp: time,
          read: false,
          type: 'status_change',
          orderId
        };
      case 'baking':
        return {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: { en: 'Baking in Wood-Fired Oven 🔥', ja: '石窯オーブンで焼成中 🔥' },
          message: {
            en: `Order #${orderNumber} is baking at 800°F to crisp golden perfection!`,
            ja: `注文番号 #${orderNumber} を石窯オーブンで香ばしく焼き上げ中です！`
          },
          timestamp: time,
          read: false,
          type: 'status_change',
          orderId
        };
      case 'out_for_delivery':
        return {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: { en: 'Out for Delivery 🚚', ja: '配達中 🚚' },
          message: {
            en: `Order #${orderNumber} is hot and on its way to your address!`,
            ja: `注文番号 #${orderNumber} をアツアツの状態でドライバーがお届けに向かっています！`
          },
          timestamp: time,
          read: false,
          type: 'status_change',
          orderId
        };
      case 'ready_for_pickup':
        return {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: { en: 'Ready for Pickup 🛍️', ja: 'お受け取り準備完了 🛍️' },
          message: {
            en: `Order #${orderNumber} is ready for pick up at the store counter!`,
            ja: `注文番号 #${orderNumber} のお受け取り準備が整いました！`
          },
          timestamp: time,
          read: false,
          type: 'status_change',
          orderId
        };
      case 'delivered':
        return {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: { en: 'Order Delivered! 🎉', ja: 'お届け完了！ 🎉' },
          message: {
            en: `Order #${orderNumber} has been delivered. Enjoy your meal!`,
            ja: `注文番号 #${orderNumber} のお届けが完了しました。ご賞味ください！`
          },
          timestamp: time,
          read: false,
          type: 'status_change',
          orderId
        };
      case 'cancelled':
      default:
        return {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: { en: 'Order Status Updated', ja: '注文ステータス更新' },
          message: {
            en: `Order #${orderNumber} status changed to ${status}.`,
            ja: `注文番号 #${orderNumber} のステータスが ${status} に更新されました。`
          },
          timestamp: time,
          read: false,
          type: 'status_change',
          orderId
        };
    }
  };

  // Broadcast Channel setup for cross-tab real-time sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.onmessage = (event) => {
          const { type, payload, senderTabId } = event.data || {};
          if (senderTabId === TAB_ID) return; // Skip messages sent by this tab instance

          if (type === 'NEW_ORDER') {
            const newOrder: Order = payload;
            setOrders((prev) => {
              if (prev.some((o) => o.id === newOrder.id)) return prev;
              return [newOrder, ...prev];
            });
            playOrderNotificationSound();
            setLatestOrderAlert(newOrder);
            setNotifications((prev) => [
              {
                id: 'notif-' + Date.now(),
                title: {
                  en: 'New Order Received!',
                  ja: '新規注文が届きました！'
                },
                message: {
                  en: `Order #${newOrder.orderNumber} placed by ${newOrder.customerName}`,
                  ja: `注文番号 #${newOrder.orderNumber}（${newOrder.customerName}様）`
                },
                timestamp: new Date().toLocaleTimeString(),
                read: false,
                type: 'new_order',
                orderId: newOrder.id
              },
              ...prev
            ]);
          } else if (type === 'STATUS_CHANGE') {
            const { orderId, status } = payload;
            let updatedOrderNum = '';
            setOrders((prev) =>
              prev.map((o) => {
                if (o.id === orderId) {
                  updatedOrderNum = o.orderNumber;
                  return { ...o, status, updatedAt: new Date().toISOString() };
                }
                return o;
              })
            );
            const statusNotif = createStatusNotification(updatedOrderNum || 'ROMA-ORDER', status, orderId);
            setNotifications((prev) => [statusNotif, ...prev]);
            setLatestCustomerStatusAlert({
              id: 'csa-' + Date.now(),
              orderId,
              orderNumber: updatedOrderNum || 'ROMA-ORDER',
              status,
              timestamp: new Date().toLocaleTimeString()
            });
            playOrderNotificationSound();
          } else if (type === 'DELETE_ORDER') {
            const { orderId } = payload;
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
          } else if (type === 'CLEAR_HISTORY') {
            const { customerId } = payload || {};
            setOrders((prev) =>
              customerId
                ? prev.filter((o) => o.customerId !== customerId && o.customerId !== 'usr-customer-1')
                : []
            );
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  const broadcastMessage = (type: string, payload: unknown) => {
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ type, payload, senderTabId: TAB_ID });
        channel.close();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      orderNumber: `ROMA-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders((prev) => {
      if (prev.some((o) => o.id === newOrder.id)) return prev;
      return [newOrder, ...prev];
    });
    broadcastMessage('NEW_ORDER', newOrder);
    playOrderNotificationSound();
    setLatestOrderAlert(newOrder);

    const newOrderNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: {
        en: 'Order Placed Successfully!',
        ja: 'ご注文を受け付けました！'
      },
      message: {
        en: `Order #${newOrder.orderNumber} placed. Your pizza is queued in the kitchen.`,
        ja: `注文番号 #${newOrder.orderNumber} を受け付けました。厨房で調理を開始します。`
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'new_order',
      orderId: newOrder.id
    };
    setNotifications((prev) => [newOrderNotif, ...prev]);

    // Update customer loyalty points
    if (currentUser.role === 'customer') {
      const earnedPoints = Math.floor(newOrder.totalAmount);
      const updatedUser = {
        ...currentUser,
        loyaltyPoints: currentUser.loyaltyPoints + earnedPoints
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('pizzeria_user', JSON.stringify(updatedUser));
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    let targetNum = '';
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          targetNum = o.orderNumber;
          return { ...o, status, updatedAt: new Date().toISOString() };
        }
        return o;
      })
    );
    broadcastMessage('STATUS_CHANGE', { orderId, status });

    const statusNotif = createStatusNotification(targetNum || 'ROMA-ORDER', status, orderId);
    setNotifications((prev) => [statusNotif, ...prev]);

    setLatestCustomerStatusAlert({
      id: 'csa-' + Date.now(),
      orderId,
      orderNumber: targetNum || 'ROMA-ORDER',
      status,
      timestamp: new Date().toLocaleTimeString()
    });
    playOrderNotificationSound();
  };

  // Global background auto-progression for active orders
  useEffect(() => {
    const activeOrders = orders.filter(
      (o) => o.status !== 'delivered' && o.status !== 'cancelled'
    );

    if (activeOrders.length === 0) return;

    const timer = setInterval(() => {
      const targetOrder = activeOrders[0];
      if (!targetOrder) return;

      const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
        received: 'preparing',
        preparing: 'baking',
        baking: targetOrder.orderType === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup',
        out_for_delivery: 'delivered',
        ready_for_pickup: 'delivered',
        delivered: null,
        cancelled: null
      };

      const nextStatus = nextStatusMap[targetOrder.status];
      if (nextStatus) {
        updateOrderStatus(targetOrder.id, nextStatus);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [orders]);

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    broadcastMessage('DELETE_ORDER', { orderId });
  };

  const clearOrderHistory = (customerId?: string) => {
    setOrders((prev) =>
      customerId
        ? prev.filter((o) => o.customerId !== customerId && o.customerId !== 'usr-customer-1')
        : []
    );
    broadcastMessage('CLEAR_HISTORY', { customerId });
  };

  // 6. Cart state
  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('pizzeria_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pizzeria_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<OrderItem, 'id'>) => {
    const newItem: OrderItem = {
      ...item,
      id: 'cart-item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5)
    };
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const newCount = i.count + delta;
            return newCount > 0 ? { ...i, count: newCount } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const clearCart = () => setCart([]);

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        switchRole,
        registeredUsers,
        loginUser,
        registerUser,
        logoutUser,
        pizzas,
        addPizza,
        updatePizza,
        deletePizza,
        togglePizzaStock,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        deleteOrder,
        clearOrderHistory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        notifications,
        markNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        latestOrderAlert,
        dismissOrderAlert,
        latestCustomerStatusAlert,
        dismissCustomerStatusAlert
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
