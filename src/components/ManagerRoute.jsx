import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function ManagerRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null); // null = loading
    const [isManager, setIsManager] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                const email = session.user.email?.toLowerCase();
                const managers = [
                    'aishasadiqa441@gmail.com', 
                    'ijazwajeeha6@gmail.com',
                    'admin@aifur.com', 
                    'manager@aifur.com',
                    'aishaaltaf@gmail.com',
                    'pmls@gmail.com'
                ];

                const hasManagerRole = managers.includes(email) || 
                                     email.endsWith('@aifur.com') ||
                                     email.includes('admin') ||
                                     email.includes('manager') ||
                                     email.includes('ops') ||
                                     email.includes('agent');

                setIsManager(hasManagerRole);
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

    if (!isAuth || !isManager) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
}
