// Heartbeat v1.3.2 - Master Control Active
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ManagerRoute from './components/ManagerRoute';
import { supabase } from './utils/supabaseClient';
import { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';

import DashboardLayout from "./components/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import DashboardReservations from "./pages/dashboard/Reservations";
import TableManagement from "./pages/dashboard/Tables";
import MenuManager from "./pages/dashboard/MenuManager";
import Analytics from "./pages/dashboard/Analytics";
import Customers from "./pages/dashboard/Customers";
import Messages from "./pages/dashboard/Messages";
import Settings from "./pages/dashboard/Settings";
import { isManager } from "./utils/auth";
import './dashboard.css';

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    // Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('supabase_session', JSON.stringify(session));
          
          const meta = session.user.user_metadata || {};
          const profile = {
            id: session.user.id,
            name: meta.name || meta.full_name || session.user.email.split('@')[0],
            email: session.user.email,
            avatar: meta.avatar_url,
            role: isManager(session.user.email) ? 'manager' : 'customer'
          };
          localStorage.setItem('user', JSON.stringify(profile));
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('supabase_session');
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user_phone');
        }
      }
    );

    // Config Fetch & Listener
    const fetchConfig = async () => {
      const { data } = await supabase.from('restaurant_config').select('value').eq('key', 'maintenance_mode').maybeSingle();
      if (data) setMaintenanceMode(data.value === 'true');
      setLoadingConfig(false);
    };
    fetchConfig();

    const channel = supabase.channel('app_config_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_config' }, 
        (payload) => {
          if (payload.new && payload.new.key === 'maintenance_mode') {
             setMaintenanceMode(payload.new.value === 'true');
          }
        })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const MaintenanceOverlay = () => (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white text-center p-6">
      <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mb-8"></div>
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">System Offline</h1>
      <p className="text-gray-400 font-bold max-w-md mx-auto text-lg">Aifur is currently undergoing scheduled maintenance. Please check back shortly.</p>
      <button onClick={() => window.location.href = '/login'} className="mt-12 text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-white transition-colors">Staff Login</button>
    </div>
  );

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Operations Dashboard (Manager Side) - PROTECTED */}
          <Route path="/admin-ops" element={<ManagerRoute><DashboardLayout /></ManagerRoute>}>
            <Route index element={<Overview />} />
            <Route path="reservations" element={<DashboardReservations />} />
            <Route path="tables" element={<TableManagement />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="customers" element={<Customers />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public Website & User Side */}
          <Route path="/" element={maintenanceMode ? <MaintenanceOverlay /> : <><Navbar /><Landing /><Footer /></>} />
          <Route path="/menu" element={maintenanceMode ? <MaintenanceOverlay /> : <><Navbar /><Menu /><Footer /></>} />
          <Route path="/reservations" element={maintenanceMode ? <MaintenanceOverlay /> : <><Navbar /><Reservations /><Footer /></>} />
          <Route path="/about" element={maintenanceMode ? <MaintenanceOverlay /> : <><Navbar /><About /><Footer /></>} />
          <Route path="/contact" element={maintenanceMode ? <MaintenanceOverlay /> : <><Navbar /><Contact /><Footer /></>} />
          <Route path="/signup" element={maintenanceMode ? <MaintenanceOverlay /> : <><Navbar /><Signup /><Footer /></>} />
          
          {/* User Dashboard (Customer Side) */}
          <Route path="/profile" element={maintenanceMode ? <MaintenanceOverlay /> : <ProtectedRoute><><Navbar /><Profile /><Footer /></></ProtectedRoute>} />
          <Route path="/user-dashboard" element={maintenanceMode ? <MaintenanceOverlay /> : <ProtectedRoute><><Navbar /><Dashboard /><Footer /></></ProtectedRoute>} />

          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

