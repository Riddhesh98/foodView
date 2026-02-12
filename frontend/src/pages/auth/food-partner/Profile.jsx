import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";




const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  console.log(id)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/food/foodpartner/${id}`,{
            withCredentials: true
          }
        );
  
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodItems);
  
        console.log(response.data.foodPartner);
        console.log(response.data.foodItems);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    if (id) {
      fetchProfile();
    }
  }, [id]);
  

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ================= HEADER ================= */}
      <section className="px-6 py-8 border-b border-gray-800">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

          {/* LEFT: Profile Image */}
          <img
            src="https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400"
            alt="profile"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-pink-500"
          />

          {/* RIGHT: Details */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{profile?.name}</h1>
            <p className="text-gray-400 mt-1">{profile?.address}</p>
            {/* <p className="mt-3 text-sm text-gray-300">{profile?.bio}</p> */}

            {/* <button className="mt-4 px-5 py-2 bg-pink-600 hover:bg-pink-700 transition rounded-lg text-sm font-medium">
              Follow
            </button> */}
          </div>
        </div>
      </section>

      {/* ================= MEALS SECTION ================= */}
      <section className="px-6 py-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Meals Overview</h2>

        <div className="flex gap-10">
          <div>
            <p className="text-2xl font-bold">{profile?.totalMeals}</p>
            <p className="text-gray-400 text-sm">Total Meals</p>
          </div>

          <div>
            <p className="text-2xl font-bold">{profile?.customersServed}</p>
            <p className="text-gray-400 text-sm">Customers Served</p>
          </div>
        </div>
      </section>


      {/* ================= REELS GRID ================= */}
      <section className="grid grid-cols-3 gap-[2px]">
        {videos.map((v) => (
          <div
            key={v.id}
            className="relative aspect-[9/16] bg-gray-900 overflow-hidden group"
          >
            <video
              src={v.video}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
            />
          </div>
        ))}
      </section>

    </main>
  );
};

export default Profile;
