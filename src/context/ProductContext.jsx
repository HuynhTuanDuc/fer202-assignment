import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // api.getFigures() already filters isDeleted !== true
      const data = await api.getFigures();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching figures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData) => {
    const newProduct = await api.addFigure(productData);
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id, productData) => {
    const updated = await api.updateFigure(id, productData);
    setProducts(prev => prev.map(p => String(p.id) === String(id) ? updated : p));
    return updated;
  };

  // Soft delete: remove from state (api marks isDeleted: true in DB)
  const deleteProduct = async (id) => {
    await api.deleteFigure(id);
    setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  // Update stock locally after checkout (so UI reflects immediately)
  const updateProductStockLocally = (id, newStock) => {
    setProducts(prev => prev.map(p =>
      String(p.id) === String(id) ? { ...p, stock: newStock } : p
    ));
  };

  const gameSeriesList = useMemo(() => {
    const games = new Set(products.map(p => p.gameSeries).filter(Boolean));
    return ['All', ...Array.from(games)];
  }, [products]);

  const categoriesList = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.gameSeries.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesGame = selectedGame === 'All' || p.gameSeries === selectedGame;

        return matchesSearch && matchesCategory && matchesGame;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, searchTerm, selectedCategory, selectedGame, sortBy]);

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        loading,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedGame,
        setSelectedGame,
        sortBy,
        setSortBy,
        gameSeriesList,
        categoriesList,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStockLocally
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
