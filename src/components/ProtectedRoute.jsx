import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null); // null = loading, true = auth, false = not auth

    useEffect(() => {
        let isMounted = true;

        // Synchronous check to prevent infinite loading lockups
        const storedUser = localStorage.getItem('user');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (storedUser && isLoggedIn === 'true') {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!isMounted) return;
                if (event === 'SIGNED_IN' && session) {
                    setIsAuth(true);
                } else if (event === 'SIGNED_OUT') {
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
