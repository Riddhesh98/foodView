import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Importing icons
import { Heart, MessageCircle, Bookmark, Clapperboard, User } from "lucide-react";

const UserHome = () => {
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('reels');
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/food`,
          { withCredentials: true }
        );
        const fetchedVideos = response.data.foodItems.map(video => ({
          ...video,
          // Ensure these exist even if backend doesn't send them initially
          isLiked: video.isLiked || false, 
          isSaved: video.isSaved || false, 
          likeCount: video.likeCount || 0,
          saveCount: video.saveCount || 0
        }));
        setVideos(fetchedVideos);
        console.log("Fetched videos:", fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error.response?.data || error.message);
      }
    };
    fetchVideos();
  }, []);

  // 🔹 Auto play/pause logic (Ensures only one video plays)
  useEffect(() => {
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.currentTime = 0; 
            video.play().catch(e => console.log("Autoplay prevented", e));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 } 
    );

    videoRefs.current.forEach((video) => { if (video) observer.observe(video); });

    return () => observer.disconnect();
  }, [videos]);

  // 🔹 Disable Scrolling UP (Mouse Wheel)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.deltaY < 0) {
        if (container.scrollTop <= 0) return; 
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // 🔹 Scroll to next (Click Handler)
  const handleNext = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  // --- LIKE HANDLER ---
  const toggleLike = async (index, e) => {
    e.stopPropagation();
    
    // 1. Optimistic Update
    const newVideos = [...videos];
    const video = newVideos[index];
    const isCurrentlyLiked = video.isLiked;
    
    video.isLiked = !isCurrentlyLiked;
    video.likeCount = isCurrentlyLiked ? video.likeCount - 1 : video.likeCount + 1;
    setVideos(newVideos);

    try {
      // 2. API Call
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/food/like/${video._id}`,
        {}, 
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Like failed:", error);
      // Rollback on error
      const revertedVideos = [...videos];
      revertedVideos[index].isLiked = isCurrentlyLiked;
      revertedVideos[index].likeCount = isCurrentlyLiked ? video.likeCount + 1 : video.likeCount - 1;
      setVideos(revertedVideos);
    }
  };

  // --- SAVE HANDLER (Updated with Count) ---
  const toggleSave = async (index, e) => {
    e.stopPropagation();

    // 1. Optimistic Update
    const newVideos = [...videos];
    const video = newVideos[index];
    const isCurrentlySaved = video.isSaved;

    video.isSaved = !isCurrentlySaved;
    // Update the count optimistically
    video.saveCount = isCurrentlySaved ? video.saveCount - 1 : video.saveCount + 1;
    
    setVideos(newVideos);

    try {
      // 2. API Call
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/food/save/${video._id}`,
        {}, 
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Save failed:", error);
      // Rollback on error
      const revertedVideos = [...videos];
      revertedVideos[index].isSaved = isCurrentlySaved;
      // Revert the count
      revertedVideos[index].saveCount = isCurrentlySaved ? video.saveCount + 1 : video.saveCount - 1;
      setVideos(revertedVideos);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if(tab === 'saved') navigate('/user/saved-reels');
    if(tab === 'profile') navigate('/user/profile');
  };

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden font-sans">
      
      {/* SCROLL CONTAINER */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {videos.map((item, index) => (
          <div
            key={item._id}
            className="h-screen w-full snap-start relative flex items-center justify-center bg-gray-900"
            onClick={handleNext}
          >
            {/* VIDEO PLAYER */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.video}
              className="h-full w-full object-cover"
              muted
              playsInline
              loop={true} 
              preload="metadata"
            />

            {/* DARK GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none"></div>

            {/* --- RIGHT SIDEBAR ACTIONS --- */}
            <div className="absolute bottom-32 right-4 z-30 flex flex-col items-center gap-6">
                
                {/* Like Button */}
                <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={(e) => toggleLike(index, e)}
                        className="p-2 active:scale-90 transition-transform"
                    >
                        <Heart 
                            size={32} 
                            className={item.isLiked ? "fill-red-500 text-red-500" : "text-white"} 
                            strokeWidth={2}
                        />
                    </button>
                    <span className="text-xs font-semibold drop-shadow-md">{item.likeCount}</span>
                </div>

                {/* Comment Button */}
                <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={(e) => { e.stopPropagation(); /* Open comment modal */ }} 
                        className="p-2 active:scale-90 transition-transform"
                    >
                        <MessageCircle size={30} className="text-white" />
                    </button>
                    <span className="text-xs font-semibold drop-shadow-md">45</span>
                </div>

                {/* Save Button */}
                <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={(e) => toggleSave(index, e)}
                        className="p-2 active:scale-90 transition-transform"
                    >
                        <Bookmark 
                            size={30} 
                            className={item.isSaved ? "fill-yellow-400 text-yellow-400" : "text-white"} 
                        />
                    </button>
                    {/* ADDED SAVE COUNT HERE */}
                    <span className="text-xs font-semibold drop-shadow-md">{item.saveCount}</span>
                </div>
            </div>

            {/* --- BOTTOM INFO SECTION --- */}
            <div className="absolute bottom-20 left-4 z-20 w-3/4 text-left pointer-events-none">
              <div className="flex items-center gap-3 mb-3 pointer-events-auto">
                <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-gray-700">
                    <User className="h-full w-full p-1" />
                </div>
                <h2 className="text-lg font-bold drop-shadow-md truncate">{item.name}</h2>
                
                <Link
                  to={`/foodpartner/${item.foodPartner}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1 bg-red-600/90 text-xs font-bold rounded-full text-white backdrop-blur-sm"
                >
                  Visit Store
                </Link>
              </div>

              <p className="text-sm text-gray-100 mb-2 line-clamp-2 drop-shadow-md font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <div className="absolute bottom-0 w-full z-50 bg-black border-t border-gray-800 pb-safe">
        <div className="flex justify-around items-center py-3 text-gray-400">
          
          <button 
            onClick={() => handleTabChange('reels')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'reels' ? 'text-white' : 'hover:text-gray-200'}`}
          >
            <Clapperboard size={24} className={activeTab === 'reels' ? 'fill-white' : ''} />
            <span className="text-[10px] font-medium">Reels</span>
          </button>

          <button 
            onClick={() => handleTabChange('saved')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'saved' ? 'text-white' : 'hover:text-gray-200'}`}
          >
            <Bookmark size={24} className={activeTab === 'saved' ? 'fill-white' : ''} />
            <span className="text-[10px] font-medium">Saved</span>
          </button>

          <button 
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-white' : 'hover:text-gray-200'}`}
          >
            <User size={24} className={activeTab === 'profile' ? 'fill-white' : ''} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHome;