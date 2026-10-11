import { useEffect, useState, useRef } from "react";
import VideoCall from "./VideoCall";
function Chat({
  users = [],
  connectedUser = [],
  handleChange,
  sendMessage,
  handleSubmit,
  setReceiverId,
  messages = [],
  currentUser,
  isTyping,
  unreadMessages = {},
  recording,
  startRecording,
  stopRecording,
  audioURL,
  cancelVoice,
  sending,
  handleAttachmentClick,
  fileInputRef,
  handleFileChange,
  selectedFile,
  handleSendAttachment,
  cancelAttachment,
  handleStartCall,
  handleStartVideoCall,
  handleAcceptCall,
  handleRejectCall,
  incomingCall,
  remoteAudioRef,
  handleEndCall,
  callStatus,
  toggleMuted,
  isMuted,
  callDuration,
  formatCallDuration,
  localVideoRef,
  remoteVideoRef,
  localStream,
  remoteStream,
  toggleCamera,
  isVideoCameraOff,
  showVideoCall,
  setShowVideoCall,
  activeCallPartner: activeCallPartnerFromProps,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()));

  const getMessageTime = (message) => {
    if (!message?.createdAt) return "";
    return new Date(message.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  useEffect(() => {
    if (selectedUser?._id) {
      setReceiverId(selectedUser._id);
    }
  }, [selectedUser, setReceiverId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages, isTyping]);
  const caller = users.find(user => user._id === incomingCall?.callerId);
  const activeCallPartner = activeCallPartnerFromProps || selectedUser || caller || users.find(u => u._id === incomingCall?.callerId);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#FAF5FF] via-[#FFF1F2] to-[#F0FDFA] flex justify-center items-center p-3 sm:p-5 md:p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-10 left-10 w-72 h-72 rounded-full bg-[#FDA4AF]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#C4B5FD]/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[#99F6E4]/20 blur-3xl" />

      {/* Main Chat Container Card */}
      <div className="relative w-full max-w-6xl h-[84vh] min-h-[620px] max-h-[860px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#C4B5FD]/20 overflow-hidden flex flex-col border border-[#C4B5FD]/40">

        {/* Incoming Call Ringing Banner */}
        {callStatus === "ringing" && incomingCall && (
          <div className="w-full bg-gradient-to-r from-[#FDA4AF] via-[#C4B5FD] to-[#99F6E4] text-[#1E1B4B] px-5 py-3.5 flex items-center justify-between shadow-md border-b border-white/50 z-20">
            {/* Caller information */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-sm text-[#1E1B4B] flex items-center justify-center text-lg shadow-xs animate-bounce">
                  {incomingCall.callType === "video" ? "📹" : "📞"}
                </div>
                <span className="absolute -inset-1 rounded-2xl border-2 border-white/60 animate-ping"></span>
              </div>
              <div>
                <p className="font-extrabold text-[#1E1B4B] text-sm">
                  {users.find(user => user._id === incomingCall.callerId)?.name || caller?.name || "Someone"} is calling...
                </p>
                <p className="text-xs text-[#1E1B4B]/80 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  {incomingCall.callType === "video" ? "Incoming video call" : "Incoming voice call"}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleRejectCall}
                className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm transition flex items-center gap-1 cursor-pointer"
              >
                ✕ Decline
              </button>
              <button
                type="button"
                onClick={handleAcceptCall}
                className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1 cursor-pointer animate-pulse"
              >
                {incomingCall.callType === "video" ? "📹 Answer Video" : "📞 Answer"}
              </button>
            </div>
          </div>
        )}

        {/* Outgoing Calling Banner */}
        {callStatus === "calling" && (
          <div className="w-full bg-gradient-to-r from-[#EDE9FE] via-[#FCE7F3] to-[#FEF3C7] text-[#1E1B4B] px-5 py-3.5 flex items-center justify-between border-b border-[#C4B5FD]/40 shadow-sm z-20">
            {/* Caller info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/90 text-[#7C3AED] flex items-center justify-center text-lg shadow-xs">
                  📞
                </div>
                <span className="absolute -inset-1 rounded-2xl border border-[#C4B5FD] animate-ping"></span>
              </div>
              <div>
                <p className="font-extrabold text-[#1E1B4B] text-sm">
                  Calling {selectedUser?.name || "User"}...
                </p>
                <p className="text-xs text-[#1E1B4B]/70 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  Outgoing voice call • Ringing...
                </p>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEndCall}
                className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                ✕ Cancel Call
              </button>
            </div>
          </div>
        )}

        {/* Active Connected Call Bar */}
        {callStatus === "connected" && (
          <div className="w-full bg-[#1E1B4B] text-white px-5 py-3 flex items-center justify-between border-b border-[#C4B5FD]/30 shadow-lg z-20">
            {/* Left: Partner info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#99F6E4] to-[#C4B5FD] text-[#1E1B4B] flex items-center justify-center font-black shadow-xs">
                  {activeCallPartner?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#1E1B4B] rounded-full animate-ping"></span>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#1E1B4B] rounded-full"></span>
              </div>

              <div>
                <p className="font-bold text-white text-sm">
                  {activeCallPartner?.name || "Connected User"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#99F6E4] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#99F6E4] animate-pulse"></span>
                    In Call
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs font-mono tracking-wider text-white font-semibold bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
                    {formatCallDuration ? formatCallDuration(callDuration) : `${callDuration || 0}s`}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Audio Wave Visualizer */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
              <div className="w-1 h-2.5 bg-[#99F6E4] rounded-full animate-pulse"></div>
              <div className="w-1 h-5 bg-[#FDA4AF] rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-2 bg-[#C4B5FD] rounded-full animate-pulse delay-150"></div>
              <div className="w-1 h-4 bg-[#FED7AA] rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-3 bg-[#99F6E4] rounded-full animate-pulse delay-200"></div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMuted}
                className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${isMuted
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                  : "bg-white/15 hover:bg-white/25 text-white"
                  }`}
                title={isMuted ? "Unmute microphone" : "Mute microphone"}
              >
                {isMuted ? "🔇 Unmute" : "🎙️ Mute"}
              </button>

              {showVideoCall && (
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${isVideoCameraOff
                    ? "bg-white/15 hover:bg-white/25 text-white"
                    : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm"
                    }`}
                  title={isVideoCameraOff ? "Turn camera on" : "Turn camera off"}
                >
                  {isVideoCameraOff ? "📷 Video Off" : "📹 Video On"}
                </button>
              )}

              <button
                type="button"
                onClick={handleEndCall}
                className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
              >
                ✕ End Call
              </button>
            </div>
          </div>
        )}

        {/* Main Chat Interface Body (Sidebar + Chat Area) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-full sm:w-80 md:w-[340px] border-r border-[#C4B5FD]/30 flex flex-col bg-white/70 backdrop-blur-md">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#C4B5FD]/20 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-[#1E1B4B]">Chats</h1>
                <p className="text-xs text-[#1E1B4B]/60 font-semibold mt-0.5">
                  {connectedUser.length} {connectedUser.length === 1 ? "user" : "users"} online
                </p>
              </div>
              <div className="h-8 px-2.5 rounded-full bg-[#99F6E4]/40 text-[#0F766E] border border-[#99F6E4] flex items-center gap-1 font-bold text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                Live
              </div>
            </div>

            {/* Search Input */}
            <div className="px-4 py-3">
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20 outline-none transition"
                />
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isSelected = selectedUser?._id === user._id;
                  const isOnline = connectedUser.includes(user._id);
                  const unreadCount = unreadMessages?.[user._id] || 0;

                  return (
                    <button
                      onClick={() => setSelectedUser(user)}
                      key={user._id}
                      className={`flex items-center w-full gap-3 p-2.5 rounded-2xl transition cursor-pointer text-left ${isSelected
                        ? "bg-gradient-to-r from-[#FAF5FF] via-[#FFF1F2] to-[#FAF5FF] border border-[#C4B5FD] shadow-xs"
                        : "hover:bg-slate-50 border border-transparent"
                        }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-11 h-11 rounded-2xl object-cover border border-[#C4B5FD]/40 shadow-xs"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FDA4AF] via-[#C4B5FD] to-[#99F6E4] text-[#1E1B4B] flex items-center justify-center text-sm font-black shadow-xs">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}

                        {/* Online Indicator Dot */}
                        {isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-300"></span>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h6 className="font-bold text-[#1E1B4B] text-sm truncate">
                            {user.name}
                          </h6>
                          {unreadCount > 0 && (
                            <span className="bg-[#FDA4AF] text-[#1E1B4B] text-[11px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs border border-white flex-shrink-0">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs font-semibold truncate mt-0.5 flex items-center gap-1.5 ${isOnline ? "text-emerald-600" : "text-slate-400"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-slate-300"
                              }`}
                          ></span>
                          {isOnline ? "online" : "offline"}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center text-slate-400 text-xs py-10 font-medium">
                  No users found
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-white/60 via-[#FAF5FF]/30 to-[#F0FDFA]/30">
            {!selectedUser ? (
              /* No user selected */
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#FDA4AF] via-[#C4B5FD] to-[#99F6E4] flex items-center justify-center text-3xl shadow-lg shadow-[#C4B5FD]/30 transform -rotate-3 hover:rotate-0 transition duration-300">
                    💬
                  </div>
                  <h2 className="mt-5 text-xl font-black text-[#1E1B4B]">
                    Select a conversation
                  </h2>
                  <p className="mt-2 text-sm text-[#1E1B4B]/60 font-medium leading-relaxed">
                    Pick a friend from the left sidebar to start chatting, sharing files, or placing calls!
                  </p>
                </div>
              </div>
            ) : (
              /* User selected */
              <>
                {/* Chat Header */}
                <div className="h-18 px-5 sm:px-6 border-b border-[#C4B5FD]/30 bg-white/80 backdrop-blur-md flex items-center justify-between">
                  {/* User info */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {selectedUser.avatar ? (
                        <img
                          src={selectedUser.avatar}
                          alt={selectedUser.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-[#C4B5FD]/40 shadow-xs"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FDA4AF] via-[#C4B5FD] to-[#99F6E4] text-[#1E1B4B] flex items-center justify-center font-black text-sm shadow-xs">
                          {selectedUser.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}

                      {connectedUser.includes(selectedUser._id) && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-300"></span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-sm sm:text-base font-black text-[#1E1B4B]">
                        {selectedUser.name}
                      </h2>
                      <p
                        className={`text-xs font-semibold flex items-center gap-1.5 ${connectedUser.includes(selectedUser._id)
                          ? "text-emerald-600"
                          : "text-slate-400"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${connectedUser.includes(selectedUser._id)
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                            }`}
                        ></span>
                        {connectedUser.includes(selectedUser._id) ? "online" : "offline"}
                      </p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2">
                    {connectedUser.includes(selectedUser._id) && (
                      <>
                        <button
                          type="button"
                          onClick={handleStartCall}
                          className="w-10 h-10 rounded-2xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6D28D9] flex items-center justify-center text-base cursor-pointer shadow-xs transition hover:scale-105 active:scale-95"
                          title="Audio Call"
                        >
                          📞
                        </button>
                        <button
                          type="button"
                          onClick={handleStartVideoCall}
                          className="w-10 h-10 rounded-2xl bg-[#CCFBF1] hover:bg-[#99F6E4] text-[#0F766E] flex items-center justify-center text-base cursor-pointer shadow-xs transition hover:scale-105 active:scale-95"
                          title="Video Call"
                        >
                          📹
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Messages List Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                  {messages.map((message, index) => {
                    const currentTime = getMessageTime(message);
                    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
                    const nextTime = nextMessage ? getMessageTime(nextMessage) : null;
                    const isLastInGroup = !nextMessage || nextMessage.sender !== message.sender || nextTime !== currentTime;

                    return message.sender === currentUser ? (
                      /* Sent message (current user) */
                      <div className="flex justify-end" key={message._id || index}>
                        <div className="max-w-[75%] sm:max-w-[68%]">
                          <div className="bg-gradient-to-r from-[#FDA4AF] via-[#FECDD3] to-[#FED7AA] text-[#1E1B4B] px-4 py-2.5 rounded-2xl rounded-br-xs shadow-sm shadow-[#FDA4AF]/20 border border-white/60">
                            {message.messageType === "voice" || message.audioUrl ? (
                              <div className="py-1">
                                <audio controls src={message.audioURL || message.audioUrl} className="max-w-full h-9" />
                              </div>
                            ) : message.messageType === "file" || message.fileUrl ? (
                              message.fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(message.fileUrl) ? (
                                <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={message.fileUrl}
                                    alt={message.fileName || "Image"}
                                    className="max-w-xs max-h-60 rounded-xl object-cover cursor-pointer hover:opacity-95 shadow-xs"
                                  />
                                </a>
                              ) : (
                                <a
                                  href={message.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 bg-white/50 hover:bg-white/70 p-2.5 rounded-xl transition cursor-pointer max-w-xs block no-underline border border-white/80"
                                  title="Click to open file in new tab"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white text-[#1E1B4B] flex items-center justify-center text-xl font-bold shadow-xs">
                                    {message.fileName?.endsWith(".pdf") ? "📄" : "📁"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#1E1B4B] truncate">
                                      {message.fileName || message.message || "Document"}
                                    </p>
                                    <span className="text-[10px] font-bold text-[#1E1B4B]/60 uppercase">
                                      {message.fileName ? message.fileName.split('.').pop() : "FILE"}
                                    </span>
                                  </div>
                                </a>
                              )
                            ) : (
                              <p className="text-sm font-medium leading-relaxed break-words">
                                {message.message || message.content}
                              </p>
                            )}
                          </div>

                          {isLastInGroup && currentTime && (
                            <div className="flex items-center justify-end gap-1.5 mt-1 mr-1">
                              <span className="text-[11px] font-semibold text-slate-400">
                                {currentTime}
                              </span>
                              {message.isRead ? (
                                <span className="text-[#3B82F6] font-bold text-xs" title="Read">✓✓</span>
                              ) : connectedUser.includes(selectedUser?._id) ? (
                                <span className="text-slate-400 text-xs" title="Delivered">✓✓</span>
                              ) : (
                                <span className="text-slate-400 text-xs" title="Sent">✓</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Received message (other user) */
                      <div className="flex justify-start" key={message._id || index}>
                        <div className="max-w-[75%] sm:max-w-[68%]">
                          <div className="bg-white text-[#1E1B4B] px-4 py-2.5 rounded-2xl rounded-bl-xs shadow-xs border border-[#C4B5FD]/35">
                            {message.messageType === "voice" || message.audioUrl ? (
                              <div className="py-1">
                                <audio controls src={message.audioURL || message.audioUrl} className="max-w-full h-9" />
                              </div>
                            ) : message.messageType === "file" || message.fileUrl ? (
                              message.fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(message.fileUrl) ? (
                                <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={message.fileUrl}
                                    alt={message.fileName || "Image"}
                                    className="max-w-xs max-h-60 rounded-xl object-cover cursor-pointer hover:opacity-95 shadow-xs"
                                  />
                                </a>
                              ) : (
                                <a
                                  href={message.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 bg-[#FAF5FF] hover:bg-[#EDE9FE] p-2.5 rounded-xl transition cursor-pointer max-w-xs block no-underline border border-[#C4B5FD]/30"
                                  title="Click to open file in new tab"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white text-[#1E1B4B] flex items-center justify-center text-xl font-bold shadow-xs">
                                    {message.fileName?.endsWith(".pdf") ? "📄" : "📁"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#1E1B4B] truncate">
                                      {message.fileName || message.message || "Document"}
                                    </p>
                                    <span className="text-[10px] font-bold text-[#1E1B4B]/60 uppercase">
                                      {message.fileName ? message.fileName.split('.').pop() : "FILE"}
                                    </span>
                                  </div>
                                </a>
                              )
                            ) : (
                              <p className="text-sm font-medium leading-relaxed break-words">
                                {message.message || message.content}
                              </p>
                            )}
                          </div>

                          {isLastInGroup && currentTime && (
                            <div className="flex items-center justify-start gap-1 mt-1 ml-1">
                              <span className="text-[11px] font-semibold text-slate-400">
                                {currentTime}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Attachment selected banner */}
                  {selectedFile && (
                    <div className="px-4 py-2.5 bg-[#EDE9FE]/80 border border-[#C4B5FD]/50 rounded-2xl flex items-center justify-between text-xs font-semibold text-[#1E1B4B] shadow-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span>📎</span>
                        <span className="truncate">{selectedFile.name}</span>
                      </div>
                      <button type="button" onClick={cancelAttachment} className="cursor-pointer text-slate-500 hover:text-rose-600 font-bold ml-2">
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping === selectedUser._id && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1E1B4B]/60 bg-white/70 backdrop-blur-sm border border-[#C4B5FD]/30 px-3.5 py-1.5 rounded-full w-fit shadow-xs">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#C4B5FD] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#FDA4AF] rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-[#99F6E4] rounded-full animate-bounce delay-200"></span>
                      </span>
                      <span>{selectedUser.name} is typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Footer */}
                <div className="bg-white/90 backdrop-blur-md border-t border-[#C4B5FD]/30 p-3 sm:p-4">
                  <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
                    {/* Attachment button */}
                    <input
                      type="file"
                      id="file-upload"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      title="Attach file"
                    />
                    <button
                      type="button"
                      onClick={handleAttachmentClick}
                      className="w-10 h-10 rounded-2xl hover:bg-[#EDE9FE] text-slate-500 hover:text-[#6D28D9] flex items-center justify-center text-lg transition flex-shrink-0 cursor-pointer"
                      title="Attach file"
                    >
                      📎
                    </button>

                    {/* Text input */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        name="content"
                        onChange={handleChange}
                        value={sendMessage.content}
                        placeholder="Type a message..."
                        className="w-full h-11 px-4 pr-11 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20 rounded-2xl outline-none text-sm font-medium text-slate-800 placeholder-slate-400 transition"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title="Emoji"
                      >
                        😊
                      </button>
                    </div>

                    {/* Voice recording button */}
                    <button
                      onClick={recording ? stopRecording : startRecording}
                      type="button"
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition flex-shrink-0 cursor-pointer ${
                        recording
                          ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse"
                          : "hover:bg-[#EDE9FE] text-slate-500 hover:text-[#6D28D9]"
                      }`}
                      title={recording ? "Stop recording" : "Voice message"}
                    >
                      {recording ? "🛑" : "🎙️"}
                    </button>

                    {/* Voice preview */}
                    {audioURL && (
                      <div className="flex items-center gap-1.5 bg-[#EDE9FE] px-2 py-1 rounded-2xl border border-[#C4B5FD]">
                        <audio controls src={audioURL} className="h-8 max-w-[140px]" />
                        <button
                          type="button"
                          onClick={cancelVoice}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                          title="Delete recording"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Send button */}
                    <button
                      type="submit"
                      disabled={(!sendMessage.content?.trim() && !audioURL && !selectedFile) || sending}
                      className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#FDA4AF] to-[#FED7AA] hover:from-[#F43F5E] hover:to-[#FB923C] text-[#1E1B4B] hover:text-white font-bold flex items-center justify-center text-base shadow-md shadow-[#FDA4AF]/20 transition transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
                      title="Send message"
                    >
                      {sending ? "⏳" : "➤"}
                    </button>
                  </form>
                </div>
              </>
            )}

            {showVideoCall && (callStatus === "connected" || callStatus === "calling") && (
              <VideoCall
                localVideoRef={localVideoRef}
                remoteVideoRef={remoteVideoRef}
                localStream={localStream}
                remoteStream={remoteStream}
                callDuration={callDuration}
                formatCallDuration={formatCallDuration}
                isMuted={isMuted}
                toggleMuted={toggleMuted}
                toggleCamera={toggleCamera}
                isVideoCameraOff={isVideoCameraOff}
                handleEndCall={handleEndCall}
                activeCallPartner={activeCallPartner}
                onClose={() => setShowVideoCall(false)}
              />
            )}
            <audio ref={remoteAudioRef} autoPlay className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chat;