import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { isManager } from '../utils/auth';

export default function ManagerRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null); // null = loading
    const [isManagerUser, setIsManagerUser] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Synchronous check to prevent long loading times
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUser && isLoggedIn === 'true') {
            setIsAuth(true);
            setIsManagerUser(storedUser.role === 'manager');
        } else {
            setIsAuth(false);
            setIsManagerUser(false);
        }
    }, []);

    if (isAuth === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAuth || !isManagerUser) {
        // Redirect to login but save the current location so we can redirect back
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children ? children : <Outlet />;
}
