import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { isManager } from "../utils/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Sign up user with additional metadata
      console.log('Sending signup request to Supabase for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          }
        }
      });

      if (error) {
        console.error('Supabase Signup Error:', error);
        throw error;
      }

      console.log('Supabase Signup Response:', data);

      if (data?.user && !data?.session) {
        alert('Please check your email for a confirmation link!');
        navigate('/login');
        return;
      }

      // 2. If session exists (auto-login enabled in Supabase), save user and navigate
      if (data?.session) {
        localStorage.setItem('supabase_session', JSON.stringify(data.session));
        localStorage.setItem('user', JSON.stringify({ name, email }));
        
        // Optional: Manual sync to a custom profiles table if you have one
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: name,
            email: email,
            updated_at: new Date()
          });
        } catch (syncErr) {
          console.warn('Profile sync failed:', syncErr);
        }
      }

      alert('Signup successful! Welcome to Aifur.');
      navigate('/dashboard'); 

    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically redirect if already logged in (handles OAuth return)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const email = session.user.email;
        const role = isManager(email) ? 'manager' : 'customer';
        
        const meta = session.user.user_metadata || {};
        const profile = {
          id: session.user.id,
          name: meta.name || meta.full_name || email.split('@')[0],
          email: email,
          avatar: meta.avatar_url,
          role: role
        };
        localStorage.setItem("supabase_session", JSON.stringify(session));
        localStorage.setItem("user", JSON.stringify(profile));
        localStorage.setItem("isLoggedIn", "true");

        if (role === 'manager') {
          navigate("/admin-ops", { replace: true });
        } else {
          navigate("/user-dashboard", { replace: true });
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleOAuthSignup = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}` }
      });
      if (error) throw error;
    } catch (err) {
      alert(`${provider} signup failed.`);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Left Side: Aesthetic Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=1200" 
          alt="Swedish Culinary" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-2xl">Join the Aifur Family</h1>
          <p className="text-xl text-purple-100 max-w-md drop-shadow-lg font-medium">
            Create an account to track your reservations, earn rewards, and receive exclusive offers.
          </p>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 dark:bg-purple-900/10 rounded-full -ml-32 -mt-32 blur-3xl opacity-50"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400">Join Aifur for a premium dining experience.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={() => handleOAuthSignup('google')} className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-semibold text-sm text-gray-700 dark:text-gray-300">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
            </button>
            <button onClick={() => handleOAuthSignup('github')} className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-semibold text-sm text-gray-700 dark:text-gray-300">
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5 dark:invert" alt="GitHub" /> GitHub
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800"></div></div>
            <span className="relative px-4 bg-white dark:bg-gray-950 text-xs text-gray-500 uppercase tracking-widest font-bold">or sign up with email</span>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl px-4 py-4 text-gray-900 dark:text-white outline-none transition-all shadow-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl px-4 py-4 text-gray-900 dark:text-white outline-none transition-all shadow-sm"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl px-4 py-4 text-gray-900 dark:text-white outline-none transition-all shadow-sm"
                placeholder="Minimum 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:text-purple-500 font-bold underline underline-offset-4">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
