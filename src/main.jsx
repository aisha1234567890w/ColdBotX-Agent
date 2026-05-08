import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'   // ✅ Must be here
import { supabase } from './utils/supabaseClient'
import { apiCall } from './utils/api'
import { useEffect } from 'react'

import { ThemeProvider } from './context/ThemeContext'

// Handle OAuth redirect result and auth state changes
function AuthHandler({ children }) {
  useEffect(() => {
    // When Supabase redirects back with OAuth tokens, parse them and persist session
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSessionFromUrl();
        if (error) {
          // Not necessarily an error in normal navigation; ignore
          // console.warn('getSessionFromUrl:', error.message || error);
        }
        if (data?.session) {
          localStorage.setItem('supabase_session', JSON.stringify(data.session));
          // Optionally register profile on backend
          try {
            const user = data.session.user;
            await apiCall('/register-profile', {
              method: 'POST',
              body: JSON.stringify({ name: user.user_metadata?.name || user.email.split('@')[0], email: user.email })
            });
          } catch (e) {
            // ignore profile registration failure
          }
        }
      } catch (err) {
        // ignore
      }

      // Keep localStorage in sync with auth state (e.g., popup sign-in)
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          localStorage.setItem('supabase_session', JSON.stringify(session));
        } else {
          localStorage.removeItem('supabase_session');
        }
      });

      return () => {
        if (listener && listener.subscription) listener.subscription.unsubscribe();
      };
    })();
  }, []);

  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthHandler>
        <App />
      </AuthHandler>
    </ThemeProvider>
  </React.StrictMode>,
)
