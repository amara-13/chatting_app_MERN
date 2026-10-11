import { useState } from "react";

function AllUsers({
  allUsers = [],
  allPendingRequest = [],
  friendsList = [],
  userId,
  handleSendRequest,
  handleCancelRequest,
  handleAcceptRequest,
  handleRejectRequest,
  handleUnfriend,
}) {
  const [search, setSearch] = useState("");

  const filteredUsers = allUsers.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#FAF5FF] via-[#FDF2F8] to-[#EFF6FF] py-10 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Pastel decorative ambient glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#FDA4AF] rounded-full blur-3xl opacity-25 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C4B5FD] rounded-full blur-3xl opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#99F6E4] rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="mx-auto w-full max-w-3xl relative z-10">

        {/* Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] tracking-tight">
                Find Friends
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#C4B5FD]/40 text-[#1E1B4B] border border-[#C4B5FD]">
                {allUsers.length} People
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#1E1B4B]/70 font-medium">
              Discover people in the community and manage your connections.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4B5FD] pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search friends by name, email, or handle..."
            className="w-full rounded-2xl border border-[#C4B5FD]/60 bg-white/95 backdrop-blur-md py-3.5 pl-12 pr-12 text-sm font-medium text-[#1E1B4B] placeholder-[#1E1B4B]/40 outline-none transition focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#99F6E4]/30 shadow-xs"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E1B4B]/60 hover:text-[#1E1B4B] bg-[#FAF5FF] px-2 py-1 rounded-lg cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Users Card Container */}
        <div className="overflow-hidden rounded-[2rem] border border-[#C4B5FD]/50 bg-white/95 backdrop-blur-md shadow-xl shadow-[#C4B5FD]/15 divide-y divide-[#FAF5FF]">

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              // 1. Check if user is already an accepted friend
              const friendship = friendsList.find(
                (f) =>
                  f.sender?._id === user._id || f.receiver?._id === user._id
              );

              // 2. Check if there is a pending request
              const pendingRequest = allPendingRequest.find(
                (r) =>
                  r.sender?._id === user._id || r.receiver?._id === user._id
              );

              const isOutgoing = pendingRequest?.sender?._id === userId;
              const isIncoming = pendingRequest?.receiver?._id === userId;

              return (
                <div
                  key={user._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3.5 hover:bg-[#FAF5FF]/80 transition-colors"
                >

                  {/* User Profile Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-12 w-12 rounded-2xl object-cover border-2 border-[#C4B5FD] shadow-xs flex-shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#FDA4AF] via-[#C4B5FD] to-[#99F6E4] text-[#1E1B4B] flex items-center justify-center font-black text-base shadow-xs flex-shrink-0">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-sm sm:text-base text-[#1E1B4B] truncate">
                          {user.name}
                        </h2>
                        {friendship && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#99F6E4]/40 px-2.5 py-0.5 text-[11px] font-black text-[#1E1B4B] border border-[#99F6E4]">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                            Friends
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#1E1B4B]/60 font-medium truncate mt-0.5">
                        @{user.username || user.email?.split("@")[0] || "user"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {friendship ? (
                      /* STATE 1: Already Friends */
                      <>
                        <button
                          type="button"
                          onClick={() => handleUnfriend(friendship._id, user._id)}
                          className="rounded-xl bg-rose-50 hover:bg-rose-100 px-4 py-2 text-xs font-bold text-rose-500 transition cursor-pointer"
                        >
                          Unfriend
                        </button>
                      </>
                    ) : isOutgoing ? (
                      /* STATE 2: Outgoing Request (Pending + Cancel) */
                      <>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FED7AA]/50 px-3 py-1.5 text-xs font-bold text-[#1E1B4B] border border-[#FED7AA]">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(pendingRequest._id, user._id)}
                          className="rounded-xl bg-[#FAF5FF] hover:bg-[#C4B5FD]/30 px-3.5 py-1.5 text-xs font-bold text-[#1E1B4B]/70 border border-[#C4B5FD]/30 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : isIncoming ? (
                      /* STATE 3: Incoming Request (Accept & Reject) */
                      <>
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(pendingRequest._id, user._id)}
                          className="rounded-xl bg-[#99F6E4] hover:bg-[#7cedd9] px-4 py-2 text-xs font-black text-[#1E1B4B] shadow-xs transition cursor-pointer hover:-translate-y-0.5"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectRequest(pendingRequest._id, user._id)}
                          className="rounded-xl bg-[#FAF5FF] hover:bg-[#C4B5FD]/30 px-3.5 py-1.5 text-xs font-bold text-[#1E1B4B]/70 border border-[#C4B5FD]/30 transition cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      /* STATE 4: No Request (Send Request) */
                      <button
                        type="button"
                        onClick={() => handleSendRequest(user._id)}
                        className="rounded-xl bg-gradient-to-r from-[#FDA4AF] to-[#FED7AA] hover:opacity-95 px-4 py-2 text-xs font-extrabold text-[#1E1B4B] shadow-sm shadow-[#FDA4AF]/30 transition cursor-pointer hover:-translate-y-0.5 active:scale-95"
                      >
                        Send Request
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C4B5FD]/20 text-[#1E1B4B] flex items-center justify-center font-bold text-2xl mb-2">
                👥
              </div>
              <p className="text-base font-bold text-[#1E1B4B]">No users found</p>
              <p className="text-xs text-[#1E1B4B]/60 mt-1">
                {search ? `Nobody matches "${search}".` : "Check back later to connect with new friends."}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AllUsers;