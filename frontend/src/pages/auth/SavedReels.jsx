import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, Play, Bookmark, AlertCircle, Heart, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SavedReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedReels();
  }, []);

  const fetchSavedReels = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/food/saved-reels`, 
        { withCredentials: true }
      );
      setReels(response.data.savedReels || []);
    } catch (err) {
      console.error("Error fetching saved reels:", err);
      setError("Failed to load your collection.");
    } finally {
      setLoading(false);
    }
  };

  // --- COMPONENT: Video Thumbnail Card ---
  const VideoCard = ({ videoData }) => {
    const videoRef = useRef(null);

    // Hover effect: Play video on hover (Desktop)
    const handleMouseEnter = () => videoRef.current?.play().catch(() => {});
    const handleMouseLeave = () => {
        if(videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Reset to start
        }
    };

    return (
      <Link 
        to={`/reel/${videoData._id}`}
        className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-gray-900 shadow-sm transition-transform active:scale-95"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video 
          ref={videoRef}
          src={videoData.video}
          className="h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          muted
          playsInline
          loop
          preload="metadata"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>

        {/* Play Icon (Center - appears on hover/focus) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                <Play size={24} fill="white" className="text-white" />
            </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 w-full p-3">
            <h3 className="mb-1 truncate text-xs font-medium text-white/90">
                {videoData.name || "Untitled"}
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-medium text-white/70">
                <div className="flex items-center gap-1">
                    <Heart size={10} fill="currentColor" />
                    <span>{videoData.likeCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Bookmark size={10} fill="currentColor" />
                    <span>{videoData.saveCount || 0}</span>
                </div>
            </div>
        </div>
      </Link>
    );
  };

  // --- LOADING UI ---
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-red-500"></div>
        <p className="text-sm font-medium text-gray-400 animate-pulse">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe font-sans text-gray-900">
      
      {/* --- HEADER (Sticky & Blurry) --- */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200/50 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="group rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 active:scale-90"
          >
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">Saved Collection</h1>
        </div>
        
        {/* Search Icon (Optional Feature Placeholder) */}
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <Search size={20} />
        </button>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="min-h-[85vh] p-3 md:p-6">
        
        {/* Error State */}
        {error ? (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-red-50 p-4">
                <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Something went wrong</h3>
            <p className="mt-1 max-w-xs text-sm text-gray-500">{error}</p>
            <button 
                onClick={fetchSavedReels}
                className="mt-6 rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-transform active:scale-95"
            >
                Try Again
            </button>
          </div>
        ) : reels.length === 0 ? (
          
          // --- EMPTY STATE ---
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 relative">
               <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
               <div className="relative bg-white p-6 rounded-full shadow-sm border border-gray-100">
                   <Bookmark size={48} className="text-red-500 fill-red-500" />
               </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">No saved reels yet</h2>
            <p className="mt-2 max-w-xs text-sm text-gray-500 leading-relaxed">
               Your collection is looking a bit empty. Explore the feed and bookmark delicious moments to watch them later!
            </p>
            <Link 
                to="/"
                className="mt-8 rounded-full bg-red-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 active:scale-95"
            >
                Explore Reels
            </Link>
          </div>

        ) : (
          
          // --- VIDEO GRID ---
          <div>
              <div className="mb-4 flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-gray-500">
                      {reels.length} Items
                  </span>
                  {/* Sorting dropdown could go here */}
              </div>

              {/* Grid Layout: 3 columns on mobile, 4 on tablet, 5 on desktop */}
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:gap-4">
                {reels.map((item) => (
                    // We render the dedicated VideoCard component for better performance isolation
                    <VideoCard key={item._id} videoData={item.food} />
                ))}
              </div>
              
              <div className="mt-12 text-center">
                  <p className="text-xs text-gray-400">You've reached the end</p>
              </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedReels;