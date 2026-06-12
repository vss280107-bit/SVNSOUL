import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/Product';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Account from './pages/Account';
import { Cart, Wishlist, OrderConfirm, FAQ, SizeGuide, Returns } from './pages/Misc';

function AppInner() {
  const [page, setPage] = useState({ name: 'home', params: {} });
  const { user, isAdmin } = useAuth();

  const nav = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const renderPage = () => {
    const { name, params } = page;
    // Auth guards
    if (name === 'checkout' && !user) { return <Auth setPage={nav} initialMode="customer" />; }
    if (name === 'admin' && !isAdmin) { return <Auth setPage={nav} initialMode="admin" />; }
    if (name === 'account' && !user) { return <Auth setPage={nav} initialMode="customer" />; }

    switch (name) {
      case 'home': return <Home setPage={nav} />;
      case 'shop': return <Shop setPage={nav} initialParams={params} />;
      case 'product': return <ProductPage productId={params?.id} setPage={nav} />;
      case 'cart': return <Cart setPage={nav} />;
      case 'checkout': return <Checkout setPage={nav} />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      case 'login': return <Auth setPage={nav} initialMode="customer" />;
      case 'admin': return <Admin setPage={nav} />;
      case 'account': return <Account setPage={nav} />;
      case 'wishlist': return <Wishlist setPage={nav} />;
      case 'order-confirm': return <OrderConfirm setPage={nav} order={params?.order} />;
      case 'faq': return <FAQ />;
      case 'size-guide': return <SizeGuide />;
      case 'returns': return <Returns />;
      default: return <Home setPage={nav} />;
    }
  };

  return (
    <Layout page={page} setPage={nav}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
