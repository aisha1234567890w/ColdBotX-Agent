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
import { supabase } from './utils/supabaseClient';
import { useEffect } from 'react';

import DashboardLayout from "./components/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import DashboardReservations from "./pages/dashboard/Reservations";
import TableManagement from "./pages/dashboard/Tables";
import MenuManager from "./pages/dashboard/MenuManager";
import Analytics from "./pages/dashboard/Analytics";
import AiLogs from "./pages/dashboard/AiLogs";
import Customers from "./pages/dashboard/Customers";
import Settings from "./pages/dashboard/Settings";
import './dashboard.css';

function App() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('supabase_session', JSON.stringify(session));
          // Store basic user info if not already there
          if (!localStorage.getItem('user')) {
            const meta = session.user.user_metadata || {};
            const profile = {
              id: session.user.id,
              name: meta.name || meta.full_name || session.user.email.split('@')[0],
              email: session.user.email,
              avatar: meta.avatar_url,
              role: meta.role || 'customer'
            };
            localStorage.setItem('user', JSON.stringify(profile));
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('supabase_session');
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Operations Dashboard (Manager Side) - PROTECTED */}
        <Route path="/admin-ops" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="reservations" element={<DashboardReservations />} />
          <Route path="tables" element={<TableManagement />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="ai-logs" element={<AiLogs />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Public Website & User Side */}
        <Route path="/" element={<><Navbar /><Landing /><Footer /></>} />
        <Route path="/menu" element={<><Navbar /><Menu /><Footer /></>} />
        <Route path="/reservations" element={<><Navbar /><Reservations /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        
        {/* User Dashboard (Customer Side) */}
        <Route path="/profile" element={<ProtectedRoute><><Navbar /><Profile /><Footer /></></ProtectedRoute>} />
        <Route path="/user-dashboard" element={<ProtectedRoute><><Navbar /><Dashboard /><Footer /></></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

