import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserHome = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // 🔹 Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/food`,
          {
            withCredentials: true,
          }
        );

        setVideos(response.data.foodItems); // ✅ correct
      } catch (error) {
        console.error(
          "Error fetching videos:",
          error.response?.data || error.message
        );
      }
    };

    fetchVideos();
  }, []);

  // 🔹 Auto play / pause visible video
  useEffect(() => {
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          entry.isIntersecting ? video.play() : video.pause();
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  // 🔹 Click → scroll to next reel
  const handleNext = () => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black"
    >
      {videos.map((item, index) => (
        <div
          key={item._id}
          className="h-screen snap-start relative"
          onClick={handleNext}
        >
          {/* Video */}
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={item.video}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"   // 👈 ADD THIS
          />

          {/* Overlay Info */}
          <div className="absolute bottom-24 left-4 text-white z-10">
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p className="text-sm opacity-80">{item.description}</p>
          </div>

          {/* Visit Store */}
          <Link
            to={`/foodpartner/${item.foodPartner}`}
            onClick={(e) => e.stopPropagation()} // 🔥 prevents scroll on click
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full font-semibold z-10"
          >
            Visit Store
          </Link>
        </div>
      ))}
    </div>
  );
};

export default UserHome;
