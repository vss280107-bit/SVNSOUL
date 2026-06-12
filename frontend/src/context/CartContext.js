import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('svn_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('svn_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('svn_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('svn_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = (product, size, color, colorHex, qty = 1) => {
    const key = product._id + '-' + size + '-' + color;
    setCart(prev => {
      const ex = prev.find(i => i.key === key);
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, product, size, color, colorHex, qty, price: product.price }];
    });
  };

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));

  const updateQty = (key, qty) => {
    if (qty < 1) { removeFromCart(key); return; }
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const toggleWishlist = (productId) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const PROMO_CODES = { FLAT10: 0.10, NEWUSER: 0.15, SVN20: 0.20, WELCOME: 0.12, PHANTOM: 0.18 };

  return (
    <CartContext.Provider value={{ cart, cartCount, cartSubtotal, addToCart, removeFromCart, updateQty, clearCart, wishlist, toggleWishlist, PROMO_CODES }}>
      {children}
    </CartContext.Provider>
  );
}
