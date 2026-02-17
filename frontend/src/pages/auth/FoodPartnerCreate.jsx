import React, { useState } from "react";
import { Utensils, Bell, Clapperboard, Lightbulb, Upload, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerCreate = () => {
  // Separate state for everything
  const [video, setVideo] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const Navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleRemoveFile = () => {
    setVideo(null);
  };

  const handleUpload = async () => {
    if (!video) return alert("Please select a video");
    if (!name.trim()) return alert("Please enter name");
    if (!description.trim()) return alert("Please enter description");

    const formData = new FormData();

    // EXACT keys like Postman
    formData.append("video", video);
    formData.append("name", name);
    formData.append("description", description);

    try {
      const response= await axios.post("http://localhost:8000/api/food/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("Upload successful", response.data);

      // reset after success
      setVideo(null);
      setName("");
      setDescription("");
      Navigate("/user/home")
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-8">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-red-500 p-1.5">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">
            zomato <span className="text-sm font-medium text-slate-500">partner</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="h-5 w-5 cursor-pointer text-slate-400 hover:text-red-500" />
          <div className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100" />
        </div>
      </nav>

      <main className="mx-auto max-w-5xl p-4 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Upload Video</h1>
          <p className="mt-2 text-slate-500">
            Share your culinary magic with millions of foodies.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">

            {/* Upload Section */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-slate-500">
                Step 1: Select Video
              </label>

              <input
                id="videoUpload"
                type="file"
                accept="video/mp4,video/mov,video/mkv"
                className="hidden"
                onChange={handleFileChange}
              />

              {!video ? (
                <label
                  htmlFor="videoUpload"
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 flex flex-col items-center justify-center hover:border-red-400 hover:bg-red-50 transition-all"
                >
                  <Clapperboard className="h-10 w-10 text-red-500 mb-4" />
                  <p className="font-semibold text-slate-700">
                    Drop your video here
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    MP4, MOV or MKV (Max 100MB)
                  </p>
                  <span className="mt-6 rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
                    Browse Files
                  </span>
                </label>
              ) : (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-700">
                      {video.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {(video.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <label
                      htmlFor="videoUpload"
                      className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Change
                    </label>

                    <button
                      onClick={handleRemoveFile}
                      className="rounded-xl bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Video Details */}
            <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500">
                Step 2: Video Details
              </label>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter title here..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description here..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
              <div className="mb-4 flex items-center gap-2 text-amber-700">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-bold">Partner Guidelines</h3>
              </div>
              <ul className="space-y-3 text-sm text-amber-800/80">
                <li>• Use vertical (9:16) video.</li>
                <li>• Ensure good lighting & sound.</li>
                <li>• Avoid competitor branding.</li>
              </ul>
            </div>

            <button
              onClick={handleUpload}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 text-lg font-bold text-white shadow-lg hover:bg-red-600"
            >
              <Upload className="h-5 w-5" />
              Upload
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default FoodPartnerCreate;
