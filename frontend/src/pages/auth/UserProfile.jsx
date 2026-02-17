import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Calendar, Settings, ChevronLeft, 
  Edit2, Grid, Bookmark 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  // 1. Initialize as NULL
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('reels');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [])

  const fetchUser = async () => {
    try {
        // 2. Correct Axios syntax (Config is the 2nd argument)
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/auth/users/me`,
            { withCredentials: true }
        );
        console.log("Fetched User:", response.data); // Check console to see structure
        setUser(response.data.user);
    } catch (error) {
        console.error("Error fetching user:", error);
    } finally {
        setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Date unknown";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };

  // 3. Loading State (Prevents rendering empty data)
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
    );
  }

  // 4. Error State (If user is still null after loading)
  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
            <p>Failed to load profile.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      
      {/* HEADER */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
                <ChevronLeft size={24} />
            </Link>
            <h1 className="text-lg font-bold">My Profile</h1>
        </div>
        <button className="p-2 text-gray-600 hover:text-gray-900">
          <Settings size={24} />
        </button>
      </header>

      {/* PROFILE INFO */}
      <div className="bg-white px-4 pb-6 pt-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            
            {/* AVATAR */}
            <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50 border-4 border-white shadow-md">
                    <span className="text-3xl font-bold text-red-500 capitalize">
                        {/* ✅ CRITICAL FIX: Optional chaining (?.) */}
                        {user?.name?.charAt(0) || "U"}
                    </span>
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-white">
                    <Edit2 size={12} className="text-white" />
                </div>
            </div>

            {/* STATS */}
            <div className="flex gap-6 text-center pr-4">
                <div>
                    <span className="block text-lg font-bold text-gray-900">0</span>
                    <span className="text-xs text-gray-500">Reels</span>
                </div>
                <div>
                    <span className="block text-lg font-bold text-gray-900">0</span>
                    <span className="text-xs text-gray-500">Followers</span>
                </div>
                <div>
                    <span className="block text-lg font-bold text-gray-900">0</span>
                    <span className="text-xs text-gray-500">Following</span>
                </div>
            </div>
        </div>

        {/* NAME & BIO */}
        <div className="mb-4">
            <h2 className="text-2xl font-bold capitalize text-gray-900">
                {user?.name || "User"}
            </h2>
            <div className="mt-1 flex flex-col gap-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span>{user?.email || "No Email"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Joined {formatDate(user?.createdAt)}</span>
                </div>
            </div>
        </div>
        
        <div className="flex gap-3">
            <button className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600 active:scale-95 transition-transform">
                Edit Profile
            </button>
            <button className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform">
                Share Profile
            </button>
        </div>
      </div>
      
      {/* TABS */}
       <div className="mt-2 sticky top-[60px] z-10 flex border-b border-gray-200 bg-white">
        <button 
            onClick={() => setActiveTab('reels')}
            className={`flex-1 flex justify-center py-3 ${activeTab === 'reels' ? 'border-b-2 border-gray-900' : 'text-gray-400'}`}
        >
            <Grid size={24} className={activeTab === 'reels' ? 'text-gray-900' : 'text-gray-400'} />
        </button>
        <button 
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex justify-center py-3 ${activeTab === 'saved' ? 'border-b-2 border-gray-900' : 'text-gray-400'}`}
        >
            <Bookmark size={24} className={activeTab === 'saved' ? 'text-gray-900' : 'text-gray-400'} />
        </button>
      </div>

       <div className="grid grid-cols-3 gap-0.5 mt-0.5">
         <div className="col-span-3 flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
                {activeTab === 'reels' ? <Grid size={32} /> : <Bookmark size={32} />}
            </div>
            <p className="font-medium text-gray-500">
                {activeTab === 'reels' ? 'No Reels Yet' : 'No Saved Items'}
            </p>
         </div>
      </div>

    </div>
  );
};

export default UserProfile;