import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function ProtectedRoute() {
    const [isAuth, setIsAuth] = useState(null); // null = loading, true = auth, false = not auth

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                // Use getSession() which natively handles OAuth redirect tokens
                // from the URL hash (e.g., #access_token=...). This is the key fix:
                // getSession() will parse the hash, establish the session, and return it
                // BEFORE we make any auth decision.
                const { data: { session }, error } = await supabase.auth.getSession();

                if (!isMounted) return;

                if (error) {
                    console.warn("Session check error:", error.message);
                    localStorage.removeItem('supabase_session');
                    localStorage.removeItem('user');
                    setIsAuth(false);
                    return;
                }

                if (session) {
                    // Valid session found (either from storage or from OAuth redirect)
                    // Persist it to localStorage for other components
                    localStorage.setItem('supabase_session', JSON.stringify(session));
                    setIsAuth(true);
                } else {
                    // No session at all
                    localStorage.removeItem('supabase_session');
                    setIsAuth(false);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                if (isMounted) setIsAuth(false);
            }
        };

        checkAuth();

        // Also listen for auth state changes (handles late-arriving OAuth callbacks)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!isMounted) return;
                if (event === 'SIGNED_IN' && session) {
                    localStorage.setItem('supabase_session', JSON.stringify(session));
                    setIsAuth(true);
                } else if (event === 'SIGNED_OUT') {
                    localStorage.removeItem('supabase_session');
                    localStorage.removeItem('user');
                    setIsAuth(false);
                }
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    if (isAuth === null) {
        // Loading state
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
