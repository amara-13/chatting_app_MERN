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
  sending
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
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-5xl h-[650px] bg-white rounded-2xl shadow-lg overflow-hidden flex">
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

                  <button
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                    title="Search"
                  >
                    🔍
                  </button>

                  <button
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                    title="Call"
                  >
                    📞
                  </button>

                  <button
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                    title="More"
                  >
                    ⋮
                  </button>

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
                            {message.messageType === "voice" || message.audioUrl || message.audioUrl ? (
                              <audio controls src={message.audioURL || message.audioUrl} />
                            ) : (
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

                          <div className="bg-gray-600 text-black px-4 py-3 rounded-2xl rounded-tr-none shadow-sm">
                            {message.messageType === "voice" || message.audioUrl || message.audioURL ? (
                              <audio controls src={message.audioURL || message.audioUrl} />
                            ) : (
                              <p className="text-sm text-white">
                                {message.message || message.content}
                              </p>)}
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
                  <button type="button"
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl"
                    title="Attach file"
                  >
                    📎
                  </button>


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
                    disabled={!sendMessage.content?.trim() && !audioURL || sending}

                    className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center text-lg transition"
                    title="Send message"
                  >
                    {!sendMessage.content?.trim() && !audioURL || sending?"":"➤"}
                 
                  </button>
                </form>

              </div>

            </>

          )}

        </div>
      </div>

    </div>

  );

}
export default Chat;