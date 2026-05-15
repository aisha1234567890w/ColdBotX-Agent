import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [appliedOffer, setAppliedOffer] = useState(null);

  // Load from localStorage on init
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('aifur_cart') || '[]');
    const savedFavs = JSON.parse(localStorage.getItem('aifur_favs') || '[]');
    const savedOffer = localStorage.getItem('aifur_offer');
    
    setCart(savedCart);
    setFavorites(savedFavs);
    if (savedOffer) setAppliedOffer(savedOffer);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aifur_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aifur_favs', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.name === item.name);
      if (exists) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemName) => {
    setCart(prev => prev.filter(i => i.name !== itemName));
  };

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const isFav = prev.find(f => f.name === item.name);
      if (isFav) {
        return prev.filter(f => f.name !== item.name);
      }
      return [...prev, item];
    });
  };

  const claimOffer = (code) => {
    setAppliedOffer(code);
    localStorage.setItem('aifur_offer', code);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('aifur_cart');
  };

  const getSubtotal = () => cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const getDiscount = () => appliedOffer === 'WELCOME20' ? getSubtotal() * 0.2 : 0;
  const getTotal = () => getSubtotal() - getDiscount();

  return (
    <AppContext.Provider value={{ 
      cart, 
      favorites, 
      appliedOffer, 
      addToCart, 
      removeFromCart, 
      toggleFavorite, 
      claimOffer,
      clearCart,
      getSubtotal,
      getDiscount,
      getTotal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
