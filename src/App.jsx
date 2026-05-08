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
import './dashboard.css';

function App() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('supabase_session', JSON.stringify(session));
          if (!localStorage.getItem('user')) {
            const meta = session.user.user_metadata || {};
            const profile = {
              name: meta.name || session.user.email.split('@')[0],
              email: session.user.email,
            };
            localStorage.setItem('user', JSON.stringify(profile));
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('supabase_session');
          localStorage.removeItem('user');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Operations Dashboard - No Public Navbar/Footer */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="reservations" element={<DashboardReservations />} />
          <Route path="tables" element={<TableManagement />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="ai-logs" element={<AiLogs />} />
          <Route path="customers" element={<div className="p-8">Customer CRM Module (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-8">Dashboard Settings (Coming Soon)</div>} />
        </Route>

        {/* Public Website Routes */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/user-dashboard" element={<Dashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
