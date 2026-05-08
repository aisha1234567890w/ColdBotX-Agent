import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { ACHIEVEMENTS } from '../data/achievements';

const AVATAR_PRESETS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mario',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Sasha',
    'https://api.dicebear.com/7.x/open-peeps/svg?seed=Bailey',
    'https://api.dicebear.com/7.x/micah/svg?seed=George'
];

export default function Profile() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', bio: '', avatar: '' });
    const [loading, setLoading] = useState(true);
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            // 1. Try fetching from Supabase
            const { data: { user: authUser } } = await supabase.auth.getUser();

            let profileData = {};

            if (authUser) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (data) {
                    profileData = {
                        ...data,
                        email: authUser.email,
                        avatar: data.avatar_url || data.avatar,
                        // Ensure we have numbers
                        streak: data.streak || 0,
                        lessonsCompleted: data.lessons_completed || 0,
                        xp: data.xp || 0,
                        achievements: data.achievements || []
                    };
                    // CRITICAL: Sync Supabase source-of-truth back to localStorage to fix inconsistencies
                    // This ensures Dashboard and other components see the correct DB name, not stale local data
                    const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
                    localStorage.setItem('user', JSON.stringify({
                        ...currentLocal,
                        name: data.name || currentLocal.name,
                        avatar: data.avatar_url || currentLocal.avatar,
                    }));
                } else {
                    // Fallback to local storage if no DB profile yet
                    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                    profileData = { ...localUser, email: authUser.email };
                }
            } else {
                // Not logged in? Redirect.
                console.warn('Profile accessed without auth. Redirecting.');
                navigate('/login');
                return;
            }

            // Merge with course/level which might be local-only for now
            const course = localStorage.getItem('course') || 'Programming';
            const level = localStorage.getItem('level') || 'Beginner';

            const finalUser = { ...profileData, course, level };
            setUser(finalUser);
            setFormData({
                name: finalUser.name || '',
                email: finalUser.email || '',
                bio: finalUser.bio || '',
                avatar: finalUser.avatar || ''
            });

        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            const updatedUser = { ...user, ...formData };

            if (authUser) {
                const updates = {
                    id: authUser.id,
                    name: formData.name,
                    bio: formData.bio,
                    avatar_url: formData.avatar, // Mapped to correct DB column
                    updated_at: new Date(),
                };

                const { error } = await supabase.from('profiles').upsert(updates);
                if (error) throw error;
            }

            // Update local state and localStorage as backup/cache
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsEditing(false);
            // window.location.reload(); // No need to reload if state is updated
        } catch (error) {
            alert('Error saving profile: ' + error.message);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            bio: user.bio || '',
            avatar: user.avatar || ''
        });
        setIsEditing(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 800000) { // Limit to ~800KB
                alert("Image size too large. Please choose an image under 800KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 transition-colors">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                    {/* Header / Cover */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 shadow-lg overflow-hidden">
                                {(isEditing ? formData.avatar : user.avatar) ? (
                                    <img src={isEditing ? formData.avatar : user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1 w-full max-w-2xl">
                                {isEditing ? (
                                    <div className="space-y-6">
                                        {/* Details Section */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email (Read Only)</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    disabled
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        {/* Bio Section */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                rows="3"
                                                placeholder="Tell us a bit about yourself..."
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Avatar Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Choose Avatar</label>
                                            <div className="grid grid-cols-6 gap-3 mb-4">
                                                {AVATAR_PRESETS.map((url, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setFormData({ ...formData, avatar: url })}
                                                        className={`relative rounded-full overflow-hidden border-2 transition-all ${formData.avatar === url ? 'border-indigo-600 ring-2 ring-indigo-200 scale-110' : 'border-transparent hover:border-gray-300'}`}
                                                    >
                                                        <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full" />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <label className="flex-1 cursor-pointer">
                                                    <div className="w-full px-4 py-2 text-sm text-center text-gray-600 border border-gray-300 border-dashed rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition">
                                                        Upload Custom Image (Max 800KB)
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {formData.avatar && (
                                                    <button
                                                        onClick={() => setFormData({ ...formData, avatar: '' })}
                                                        className="px-3 py-2 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded-lg dark:bg-red-900/30 dark:text-red-400"
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name || 'User'}</h2>
                                        <p className="text-gray-500 dark:text-gray-400 mb-4">{user.email || 'user@example.com'}</p>

                                        {user.bio ? (
                                            <p className="text-gray-700 dark:text-gray-300 italic max-w-xl">
                                                "{user.bio}"
                                            </p>
                                        ) : (
                                            <p className="text-gray-400 dark:text-gray-500 italic text-sm">
                                                No bio yet. Click "Edit Profile" to add one.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 self-start mt-4 md:mt-0">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-lg"
                                        >
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-md"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{user.streak || 0}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak 🔥</div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{user.xp || 0}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total XP ⭐</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{user.lessonsCompleted || 0}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Done ✅</div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{user.level || 'Beginner'}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Current Level 📊</div>
                            </div>
                        </div>
                    </div>

                    {/* Course Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Learning Path</h3>
                        <div className="mb-4">
                            <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Active Course</label>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{user.course}</div>
                        </div>
                        <div className="mb-6">
                            <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Difficulty Level</label>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{user.level}</div>
                        </div>
                        <Link to="/course">
                            <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                Change Course
                            </button>
                        </Link>
                    </div>

                    {/* Achievements Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 col-span-1 md:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.achievements?.length || 0} / {ACHIEVEMENTS.length} Unlocked
                            </div>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                            {ACHIEVEMENTS.map((achievement) => {
                                const isUnlocked = user.achievements?.includes(achievement.id);
                                return (
                                    <button
                                        key={achievement.id}
                                        onClick={() => setSelectedAchievement(achievement)}
                                        className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all relative group ${isUnlocked
                                            ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-amber-200 dark:border-amber-700/50 shadow-sm hover:scale-105 cursor-pointer'
                                            : 'bg-gray-100 dark:bg-gray-700/50 grayscale opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <span className={isUnlocked ? '' : 'opacity-50'}>{achievement.icon}</span>

                                        {/* Tooltip on hover */}
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full w-max max-w-[150px] bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 hidden md:block">
                                            {achievement.title}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Achievement Detail Modal */}
                    {selectedAchievement && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAchievement(null)}>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 border-4 border-white dark:border-gray-700 shadow-xl">
                                        {selectedAchievement.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedAchievement.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedAchievement.description}</p>

                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                                        {selectedAchievement.type} Achievement
                                    </div>

                                    <button
                                        onClick={() => setSelectedAchievement(null)}
                                        className="mt-8 w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
