import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch all orders (admin)
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Fetch orders by current user (customer)
  const fetchMyOrders = useCallback(async (username) => {
    setLoadingOrders(true);
    try {
      const data = await api.getOrdersByUser(username);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching my orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Create order + deduct stock
  const createOrder = async (orderData, cartItems) => {
    // 1. Deduct stock for each item
    for (const { product, quantity } of cartItems) {
      const currentFigure = await api.getFigureById(product.id);
      if (currentFigure) {
        const newStock = Math.max(0, (currentFigure.stock || 0) - quantity);
        await api.updateFigureStock(product.id, newStock);
      }
    }

    // 2. Save order to DB
    const savedOrder = await api.createOrder(orderData);
    setOrders(prev => [savedOrder, ...prev]);
    return savedOrder;
  };

  // Soft delete order (admin)
  const softDeleteOrder = async (id) => {
    await api.softDeleteOrder(id);
    setOrders(prev => prev.filter(o => String(o.id) !== String(id)));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loadingOrders,
        fetchOrders,
        fetchMyOrders,
        createOrder,
        softDeleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
