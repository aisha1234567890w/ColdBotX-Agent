import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Simple manager check - can be moved to a separate utility or database
  const isManager = (userEmail) => {
    const managers = [
      'aishasadiqa441@gmail.com', 
      'admin@aifur.com', 
      'manager@aifur.com',
      'aishaaltaf@gmail.com', // Added based on context
      'pmls@gmail.com' // Added based on workspace user
    ];
    const isMgr = managers.includes(userEmail?.toLowerCase()) || 
                 userEmail?.toLowerCase().endsWith('@aifur.com') ||
                 userEmail?.toLowerCase().includes('admin') ||
                 userEmail?.toLowerCase().includes('manager');
    console.log(`Checking role for ${userEmail}: ${isMgr ? 'manager' : 'customer'}`);
    return isMgr;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Login success
      const userProfile = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        role: isManager(data.user.email) ? 'manager' : 'customer'
      };

      localStorage.setItem("supabase_session", JSON.stringify(data.session));
      localStorage.setItem("user", JSON.stringify(userProfile));
      localStorage.setItem("isLoggedIn", "true");

      setIsLoading(false);
      
      // Redirect based on role
      if (userProfile.role === 'manager') {
        navigate("/admin-ops");
      } else {
        navigate("/user-dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);
      setIsLoading(false);
      alert(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // This should ideally redirect to a processing page or use getSession on the target page
          redirectTo: `${window.location.origin}`
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error(`${provider} OAuth error:`, err);
      alert(`${provider} login failed: ${err.message || "Please check your Supabase configuration."}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Left Side: Aesthetic Image (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1550966841-3ee4ad05f038?auto=format&fit=crop&q=80&w=1200" 
          alt="Restaurant Ambiance" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-2xl">Aifur Swedish Restaurant</h1>
          <p className="text-xl text-indigo-100 max-w-md drop-shadow-lg font-medium">
            Join us for a unique culinary journey where Nordic traditions meet Pakistani spice.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 dark:bg-purple-900/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Please enter your details to sign in.</p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-bold text-sm text-gray-700 dark:text-gray-300 shadow-sm active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button
              onClick={() => handleOAuthLogin('github')}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-bold text-sm text-gray-700 dark:text-gray-300 shadow-sm active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5 dark:invert" alt="GitHub" />
              GitHub
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800"></div></div>
            <span className="relative px-4 bg-white dark:bg-gray-950 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">or continue with email</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl px-4 py-4 text-gray-900 dark:text-white outline-none transition-all shadow-sm"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-black text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-widest">Forgot Password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl px-4 py-4 text-gray-900 dark:text-white outline-none transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-xl shadow-indigo-500/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Sign In to Aifur"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-black underline underline-offset-4 decoration-2">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}