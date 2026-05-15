import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { isManager } from '../utils/auth';

export default function ManagerRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null); // null = loading
    const [isManagerUser, setIsManagerUser] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                const hasManagerRole = isManager(session.user.email);
                setIsManagerUser(hasManagerRole);
                setIsAuth(true);
            } else {
                setIsAuth(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuth === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAuth || !isManagerUser) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
}
