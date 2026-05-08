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
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Redirect old routes to Home or Dashboard */}
        <Route path="/onboarding" element={<Navigate to="/" replace />} />
        <Route path="/course" element={<Navigate to="/menu" replace />} />
        <Route path="/catalog" element={<Navigate to="/menu" replace />} />
        <Route path="/quiz" element={<Navigate to="/" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
