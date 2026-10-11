import { Link } from "react-router-dom";
import { Users, MessageSquare, ArrowRight } from "lucide-react";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden bg-gradient-to-br from-[#FAF5FF] via-[#FDF2F8] to-[#EFF6FF]">
      
      {/* Decorative background curves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <svg
          className="absolute -top-24 -left-24 w-[600px] h-[600px] text-[#EDE9FE]/50"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M0,0 C30,40 70,20 100,60 L100,0 Z"
            fill="currentColor"
          />
        </svg>
        <svg
          className="absolute -bottom-32 -right-24 w-[700px] h-[700px] text-[#E0F2FE]/60"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M0,100 C40,50 60,80 100,30 L100,100 Z"
            fill="currentColor"
          />
        </svg>
        <svg
          className="absolute top-1/2 -right-32 w-[500px] h-[500px] text-[#FCE7F3]/40"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="40" fill="currentColor" />
        </svg>
      </div>

      {/* Main Glass/Pastel Card */}
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-8 sm:p-12 md:p-14 lg:p-16 shadow-[0_25px_60px_-15px_rgba(196,181,253,0.35)] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Icon Badge with cute sparkles */}
            <div className="relative mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EDE9FE] via-[#FCE7F3] to-[#E0F2FE] border border-white shadow-xs flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-[#1E1B4B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  <path d="M12 8.5c-.8-1-2-1.2-2.8-.4-.8.8-.7 2.1.3 3.1l2.5 2.3 2.5-2.3c1-1 1.1-2.3.3-3.1-.8-.8-2-.6-2.8.4Z" fill="currentColor" stroke="none" />
                </svg>
              </div>

              {/* Sparkle rays at top-right of badge */}
              <div className="absolute -top-1.5 -right-2 flex flex-col gap-0.5">
                <span className="w-1 h-2 bg-[#818CF8] rounded-full rotate-45 transform origin-bottom"></span>
                <span className="w-1 h-2.5 bg-[#A855F7] rounded-full rotate-90 transform -translate-x-1.5 -translate-y-1"></span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E1B4B] tracking-tight leading-[1.15]">
              Make new friends,{" "}
              <span className="block mt-1">
                <span className="bg-gradient-to-r from-[#A855F7] via-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent">
                  share moments.
                </span>
                {/* Wavy underline curve */}
                <svg
                  className="w-48 sm:w-60 md:w-72 h-3.5 -mt-0.5 text-[#C4B5FD] stroke-current fill-none"
                  viewBox="0 0 260 14"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 5 9 Q 65 3, 130 9 T 255 7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-[#64748B] font-medium leading-relaxed">
              Connect, share, and chat in a pastel world.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                to={token ? "/users" : "/register"}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#A855F7] via-[#818CF8] to-[#38BDF8] hover:opacity-95 shadow-lg shadow-[#818CF8]/35 hover:shadow-xl hover:shadow-[#818CF8]/45 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Find Friends</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                to={token ? "/chat" : "/login"}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-[#475569] bg-white hover:bg-slate-50 border border-[#C4B5FD]/70 hover:border-[#818CF8] shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#818CF8]" />
                <span>Open Chat</span>
              </Link>
            </div>

            {/* Community Social Proof Bar */}
            <div className="mt-10 pt-4 flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&auto=format&fit=crop&crop=faces&q=80"
                  alt="Community member"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&auto=format&fit=crop&crop=faces&q=80"
                  alt="Community member"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&auto=format&fit=crop&crop=faces&q=80"
                  alt="Community member"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <div className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#818CF8] border-2 border-white flex items-center justify-center text-xs font-black shadow-xs">
                  +
                </div>
              </div>

              <div className="h-4 w-[1px] bg-slate-200"></div>

              <span className="text-xs sm:text-sm font-semibold text-[#64748B]">
                Join a friendly community
              </span>
            </div>

          </div>

          {/* Right Column: 3D Chat Bubbles Art */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6 select-none pointer-events-none">
            
            {/* Ambient Background Glow behind 3D artwork */}
            <div className="absolute w-72 h-72 bg-gradient-to-tr from-[#C4B5FD] via-[#FBCFE8] to-[#99F6E4] rounded-full blur-3xl opacity-40"></div>

            <svg
              className="w-full max-w-[340px] sm:max-w-[380px] h-auto relative drop-shadow-xl"
              viewBox="0 0 360 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Lavender / Purple 3D Bubble Gradient */}
                <linearGradient id="purpleBubbleGrad" x1="50" y1="30" x2="260" y2="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DDD6FE" />
                  <stop offset="35%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>

                {/* Pink 3D Bubble Gradient */}
                <linearGradient id="pinkBubbleGrad" x1="180" y1="120" x2="310" y2="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FED7AA" />
                  <stop offset="30%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#FB7185" />
                </linearGradient>

                {/* Diffused Ground Shadow */}
                <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                </radialGradient>

                {/* Specular Highlight Filter */}
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Ground Shadow */}
              <ellipse cx="190" cy="265" rx="110" ry="16" fill="url(#groundShadow)" />

              {/* Sparkle rays radiating from the left */}
              <g strokeLinecap="round" strokeWidth="4.5">
                <line x1="52" y1="130" x2="68" y2="138" stroke="#A78BFA" />
                <line x1="48" y1="150" x2="62" y2="150" stroke="#C084FC" />
                <line x1="56" y1="170" x2="70" y2="164" stroke="#F472B6" />
              </g>

              {/* Main 3D Purple Speech Bubble */}
              <g>
                {/* Bubble Body */}
                <path
                  d="M100 60 
                     C100 42, 230 42, 230 60
                     C250 68, 256 142, 236 162
                     C218 180, 150 182, 126 182
                     C108 182, 92 196, 78 208
                     C82 194, 86 180, 78 174
                     C60 156, 62 76, 100 60 Z"
                  fill="url(#purpleBubbleGrad)"
                />

                {/* Bubble 3D Highlight Curve */}
                <path
                  d="M104 66 C120 54, 210 54, 226 66"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.35"
                />

                {/* Center 3D White Heart */}
                <path
                  d="M168 116 
                     C168 103, 150 90, 137 103 
                     C124 90, 106 103, 106 116 
                     C106 132, 137 154, 137 154 
                     C137 154, 168 132, 168 116 Z"
                  fill="#FFFFFF"
                  filter="url(#softGlow)"
                />
              </g>

              {/* Overlapping Pink 3D Speech Bubble */}
              <g transform="translate(15, 10)">
                {/* Bubble Body */}
                <path
                  d="M220 148
                     C220 134, 305 134, 305 148
                     C320 155, 322 205, 308 218
                     C295 230, 252 230, 236 230
                     C224 230, 214 240, 204 248
                     C207 238, 210 228, 204 224
                     C192 212, 194 158, 220 148 Z"
                  fill="url(#pinkBubbleGrad)"
                />

                {/* Pink Bubble Highlight Curve */}
                <path
                  d="M224 152 C236 144, 290 144, 302 152"
                  stroke="#FFFFFF"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />

                {/* Three 3D White Dots (...) */}
                <circle cx="240" cy="184" r="5" fill="#FFFFFF" opacity="0.95" />
                <circle cx="258" cy="184" r="5" fill="#FFFFFF" opacity="0.95" />
                <circle cx="276" cy="184" r="5" fill="#FFFFFF" opacity="0.95" />
              </g>
            </svg>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;