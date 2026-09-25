import { useEffect, useState, useRef } from "react";

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
  const activeCallPartner = selectedUser || caller || users.find(u => u._id === incomingCall?.callerId);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 flex justify-center items-center p-4 md:p-6">
      <div className="w-full max-w-5xl h-[680px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-200/80">

        {/* ================= VOICE CALL TOP BAR (DOCKED ON TOP OF CHAT BOX) ================= */}
        {callStatus === "ringing" && incomingCall && (
          <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white px-5 py-3 flex items-center justify-between shadow-md border-b border-white/10 z-20">
            {/* Caller information */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center text-lg animate-bounce">
                  📞
                </div>
                <span className="absolute -inset-1 rounded-full border-2 border-emerald-300/50 animate-ping"></span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">
                  {users.find(user => user._id === incomingCall.callerId)?.name || caller?.name || "Someone"} is calling...
                </p>
                <p className="text-xs text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Incoming voice call
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleRejectCall}
                className="px-4 py-1.5 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm hover:shadow transition flex items-center gap-1 cursor-pointer"
              >
                ✕ Decline
              </button>
              <button
                type="button"
                onClick={handleAcceptCall}
                className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-950/30 transition flex items-center gap-1 cursor-pointer animate-pulse"
              >
                📞 Answer
              </button>
            </div>
          </div>
        )}

        {callStatus === "calling" && (
          <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-indigo-900/60 shadow-md z-20">
            {/* Caller information */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center text-lg">
                  📞
                </div>
                <span className="absolute -inset-1 rounded-full border border-indigo-400/40 animate-ping"></span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">
                  Calling {selectedUser?.name || "User"}...
                </p>
                <p className="text-xs text-indigo-200/90 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  Outgoing voice call • Ringing...
                </p>
              </div>
            </div>

            {/* Cancel / End Call Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEndCall}
                className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1 shadow-md hover:shadow-rose-600/30 transition cursor-pointer"
              >
                ✕ Cancel Call
              </button>
            </div>
          </div>
        )}

        {/* ================= CONNECTED / ACTIVE CALL BAR ================= */}
        {callStatus === "connected" && (
          <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white px-5 py-3 flex items-center justify-between border-b border-slate-700/60 shadow-lg z-20">
            {/* Left: User info + Live Indicator */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow">
                  {activeCallPartner?.name?.[0]?.toUpperCase() || "U"}
                </div>
                {/* Glowing Connected Dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping"></span>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>

              <div>
                <p className="font-semibold text-white text-sm">
                  {activeCallPartner?.name || "Connected User"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    In Call
                  </span>
                  <span className="text-slate-500">•</span>
                  {/* Live Timer */}
                  <span className="text-xs font-mono tracking-wider text-slate-200 font-semibold bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                    {formatCallDuration ? formatCallDuration(callDuration) : `${callDuration || 0}s`}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Live Audio Wave Animation */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/50">
              <div className="w-1 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
            </div>

            {/* Right: Controls (Mute + Camera + End Call) */}
            <div className="flex items-center gap-2.5">
              {/* Mic Mute Toggle Button */}
              <button
                type="button"
                onClick={toggleMuted}
                className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                  isMuted
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/30"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                }`}
                title={isMuted ? "Unmute microphone" : "Mute microphone"}
              >
                {isMuted ? "🔇 Unmute" : "🎙️ Mute"}
              </button>


              {/* End Call Button */}
              <button
                type="button"
                onClick={handleEndCall}
                className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1 shadow hover:shadow-rose-500/30 transition cursor-pointer"
              >
                ✕ End Call
              </button>
            </div>
          </div>
        )}

        {/* Main Chat Interface Body (Sidebar + Chat Area) */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[350px] border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Chats</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {connectedUser.length} user{connectedUser.length === 1 ? "" : "s"} online
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                💬
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-4">
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>
            {/* user list */}
            <div className="flex-1  overflow-y-auto">
              {filteredUsers.length > 0 ?
                filteredUsers.map((user) => (
                  <button onClick={() => setSelectedUser(user)}
                    key={user._id}
                    className="flex items-center block w-full  gap-2 p-2 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                  >

                    {/* Avatar */}
                    <div className="relative">

                      <div className="w-10 h-10 rounded-full bg-gray-300  flex items-center justify-center text-lg font-semibold text-gray-700">
                        {user.avatar}
                      </div>

                      {/* Online indicator */}
                      {connectedUser.includes(user._id) && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                      )}

                    </div>

                    {/* User Information */}
                    <div className="flex-1 flex items-center justify-between p-1">
                      <div className="text-left">
                        <h6 className="font-semibold text-gray-900">
                          {user.name}
                        </h6>
                        <p
                          className={`text-xs ${connectedUser.includes(user._id)
                            ? "text-green-500"
                            : "text-gray-400"
                            }`}
                        >
                          {connectedUser.includes(user._id) ? "online" : "offline"}
                        </p>
                      </div>

                      {unreadMessages?.[user._id] > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm animate-bounce-once">
                          {unreadMessages[user._id]}
                        </span>
                      )}
                    </div>

                  </button>
                )) : (
                  <div className="text-center text-gray-400 text-sm py-8">
                    No users found
                  </div>
                )}

            </div>
          </div>
          {/* Chat Area */}
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">

            {!selectedUser ? (

              /* No user selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">

                  <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-3xl">
                    💬
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-gray-700">
                    Select a user
                  </h2>

                  <p className="mt-2 text-gray-400">
                    Select a user from the list to start chatting
                  </p>

                </div>
              </div>

            ) : (

              /* User selected */
              <>
                {/* Chat Header */}
                <div className="h-16 px-5 border-b border-gray-200 bg-white flex items-center justify-between">

                  {/* User Info */}
                  <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div className="relative">

                      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                        {selectedUser.avatar}
                      </div>

                      {/* Online Dot */}
                      {connectedUser.includes(selectedUser._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}

                    </div>

                    {/* Name + Status */}
                    <div>

                      <h2 className="text-sm font-semibold text-gray-800">
                        {selectedUser.name}
                      </h2>
                      <p
                        className={
                          connectedUser.includes(selectedUser._id)
                            ? "text-xs text-green-500"
                            : "text-xs text-gray-400"
                        }
                      >
                        {connectedUser.includes(selectedUser._id)
                          ? "online"
                          : "offline"}
                      </p>

                    </div>

                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2">

                    {/* <button
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                    title="Search"
                  >
                    🔍
                  </button> */}
                    {connectedUser.includes(selectedUser._id) && (
                      <>
                      <button type="button" onClick={handleStartCall}
                        className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                        title="Call"
                      >
                        📞
                      </button >
                      <button type="button"  onClick ={()=>{window.open("/video-call","_blank")}} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
    title="Video Call">📹</button>
                      </>
                    )}

                    {/* <button
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                    title="More"
                  >
                    ⋮
                  </button> */}

                  </div>

                </div>


                <div className="flex-1 overflow-y-auto p-5 space-y-4">

                  {/* {messages.map((message, index) => ( */}
                  {messages.map((message, index) => {
                    const currentTime = getMessageTime(message);

                    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
                    const nextTime = nextMessage ? getMessageTime(nextMessage) : null;
                    const isLastInGroup = !nextMessage || nextMessage.sender !== message.sender || nextTime !== currentTime;
                    return (

                      message.sender === currentUser ? (

                        /* send message */

                        <div className="flex justify-end" key={message._id || index}>
                          <div className="max-w-[70%]">

                            <div className="bg-indigo-500 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                              {message.messageType === "voice" || message.audioUrl ? (
                                <audio controls src={message.audioURL || message.audioUrl} />
                              ) : message.messageType === "file" || message.fileUrl ? (
                                message.fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(message.fileUrl)
                                  ? (
                                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={message.fileUrl}
                                        alt={message.fileName || "Image"}
                                        className="max-w-xs max-h-60 rounded-lg object-cover cursor-pointer hover:opacity-95"
                                      /></a>
                                  ) : (
                                    <div className="flex items-center gap-3  p-1 rounded-xl transition cursor-pointer max-w-xs">
                                      {/* File Icon */}
                                      <a
                                        href={message.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3  bg-black-500/20 hover:bg-black/20 py-2 rounded-xl transition cursor-pointer max-w-xs block no-underline"
                                        title="Click to open file in new tab"
                                      >
                                        <div className="w-10 h-10 rounded-lg bg-blue-400 text-red-500 flex items-center justify-center text-xl font-bold">
                                          {message.fileName?.endsWith(".pdf") ? "📄" : "📁"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-white truncate">
                                            {message.fileName || message.message || "Document"}
                                          </p>
                                          <span className="text-xs text-white/70 uppercase">
                                            {message.fileName ? message.fileName.split('.').pop() : "FILE"}
                                          </span>
                                        </div>
                                      </a>
                                    </div>

                                  )) : (
                                <p className="text-sm text-white">
                                  {message.message || message.content}
                                </p>
                              )}
                            </div>
                            {isLastInGroup && currentTime && (
                              <p className="text-xs text-gray-400 mt-1 ml-1">
                                {currentTime}
                              </p>
                            )}
                          </div>
                        </div>

                      ) : (

                        /* receive message */

                        <div className="flex justify-start" key={message._id || index}>
                          <div className="max-w-[70%]">

                            {/* <div className="bg-gray-600 text-black px-4 py-3 rounded-2xl rounded-tr-none shadow-sm">
                            {message.messageType === "voice" || message.audioUrl || message.audioURL ? (
                              <audio controls src={message.audioURL || message.audioUrl} />
                            ) :message.messageType==="file"?(
                               <img
                                src={message.fileURL}
                                alt={message.fileName}
                                className="max-w-xs rounded-lg"
                            />
                            ):
                             (
                              <p className="text-sm text-white">
                                {message.message || message.content}
                              </p>)}
                          </div> */}
                            <div className="bg-gray-600 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                              {message.messageType === "voice" || message.audioUrl ? (
                                <audio controls src={message.audioURL || message.audioUrl} />
                              ) : message.messageType === "file" || message.fileUrl ? (
                                message.fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(message.fileUrl)
                                  ? (
                                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={message.fileUrl}
                                        alt={message.fileName || "Image"}
                                        className="max-w-xs max-h-60 rounded-lg object-cover cursor-pointer hover:opacity-95"
                                      /></a>
                                  ) : (
                                    <div className="flex items-center gap-3  p-1 rounded-xl transition cursor-pointer max-w-xs">
                                      {/* File Icon */}
                                      <a
                                        href={message.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3  bg-black-500/20 hover:bg-black/20 py-2 rounded-xl transition cursor-pointer max-w-xs block no-underline"
                                        title="Click to open file in new tab"
                                      >
                                        <div className="w-10 h-10 rounded-lg bg-blue-400 text-red-500 flex items-center justify-center text-xl font-bold">
                                          {message.fileName?.endsWith(".pdf") ? "📄" : "📁"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-white truncate">
                                            {message.fileName || message.message || "Document"}
                                          </p>
                                          <span className="text-xs text-white/70 uppercase">
                                            {message.fileName ? message.fileName.split('.').pop() : "FILE"}
                                          </span>
                                        </div>
                                      </a>
                                    </div>

                                  )) : (
                                <p className="text-sm text-white">
                                  {message.message || message.content}
                                </p>
                              )}
                            </div>

                            {isLastInGroup && currentTime && (
                              <p className="text-xs text-gray-400 mt-1 text-right mr-1">
                                {currentTime}
                              </p>
                            )}


                          </div>
                        </div>

                      )

                    )
                  })}
                  {selectedFile && (
                    <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between">
                      <p>{selectedFile.name}</p>
                      <button type="button" onClick={cancelAttachment} className="cursor-pointer">✕</button>
                    </div>
                  )}


                  {isTyping === selectedUser._id && (
                    <span className="italic text-gray-500 text-xs">
                      {selectedUser.name} is typing...
                    </span>
                  )}
                  <div ref={messagesEndRef} />

                </div>

                {/* Message Input */}
                <div >
                  <form onSubmit={handleSubmit} className="h-16 bg-white border-t border-gray-200 px-4 flex items-center gap-3" >
                    {/* Attachment */}
                    <input type="file" id="file-upload" ref={fileInputRef} onChange={handleFileChange} className="hidden" title="Attach file" />
                    <button type="button" onClick={handleAttachmentClick} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl"
                      title="Attach file">📎</button>

                    {/* Message Input */}
                    <div className="flex-1 relative">

                      <input
                        type="text" name="content" onChange={handleChange} value={sendMessage.content}
                        placeholder="Type a message..."
                        className="w-full h-11 px-4 pr-12 bg-gray-100 rounded-full outline-none text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-100"
                      />

                      {/* Emoji */}
                      <button type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500 hover:text-gray-700"
                        title="Emoji"
                      >
                        😊
                      </button>

                    </div>


                    {/* Voice */}
                    <button onClick={recording ? stopRecording : startRecording}
                      type="button"
                      className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl"
                      title="Voice message"
                    >
                      {recording ? "🛑" : "🎙️"}
                    </button>
                    {/* {audioURL && (
                    <div>
                      <audio controls src={audioURL} />
                    </div>
                  )} */}

                    {audioURL && (
                      <div className="flex items-center gap-2">
                        <audio controls src={audioURL} className="h-8" />
                        <button
                          type="button"
                          onClick={cancelVoice}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          title="Delete recording"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Send */}
                    <button type="submit"
                      disabled={!sendMessage.content?.trim() && !audioURL && !selectedFile || sending}

                      className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center text-lg transition"
                      title="Send message"
                    >
                      {!sendMessage.content?.trim() && !audioURL && !selectedFile || sending ? "" : "➤"}

                    </button>
                  </form>

                </div>

              </>

            )}
            <audio ref={remoteAudioRef} autoPlay className="hidden" />
          </div>
        </div>
      </div>

    </div>

  );

}
export default Chat;