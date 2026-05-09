import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null); // null = loading, true = auth, false = not auth

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
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
                    localStorage.setItem('supabase_session', JSON.stringify(session));
                    setIsAuth(true);
                } else {
                    localStorage.removeItem('supabase_session');
                    setIsAuth(false);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                if (isMounted) setIsAuth(false);
            }
        };

        checkAuth();

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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
}
