import { useEffect } from "react";
import styles from "./VideoCall.module.css";
import useDraggable from "../hooks/useDraggable";

function VideoCall({
  localVideoRef,
  remoteVideoRef,
  localStream,
  remoteStream,
  activeCallPartner,
  isMuted = false,
  isVideoCameraOff = false,
  toggleMuted,
  toggleCamera,
  handleEndCall,
  callDuration = 0,
  formatCallDuration,
  onClose,
}) {
  const {
    ref,
    style,
    isMaximized,
    toggleMaximize,
    onMouseDown,
    onResizeSE,
    onResizeNW,
    onResizeNE,
    onResizeSW,
  } = useDraggable({
    initW: 480,
    initH: 360,
  });

  // Ensure streams are continuously bound to video elements whenever available
  useEffect(() => {
    if (localVideoRef?.current && localStream) {
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteVideoRef?.current && remoteStream) {
      if (remoteVideoRef.current.srcObject !== remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }
  }, [remoteStream, remoteVideoRef]);

  return (
    <div className={styles.callBox} ref={ref} style={style}>
      {/* Header – drag handle & double-click to maximize */}
      <div
        className={styles.header}
        onMouseDown={onMouseDown}
        onDoubleClick={toggleMaximize}
        title="Drag to move • Double-click to expand"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <p className="text-xs font-semibold text-slate-100 truncate max-w-[180px]">
            {activeCallPartner?.name || "Video Call"}
          </p>
          <span className="text-[11px] bg-slate-800/90 px-2 py-0.5 rounded text-slate-300 font-mono">
            {formatCallDuration ? formatCallDuration(callDuration) : `${callDuration || 0}s`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Maximize / Restore Button */}
          <button
            type="button"
            onClick={toggleMaximize}
            className={styles.headerBtn}
            title={isMaximized ? "Restore window size" : "Expand to large view"}
          >
            {isMaximized ? "🗗" : "⤢"}
          </button>

          {/* Minimize / Hide Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={styles.headerBtn}
              title="Hide video window (stays connected)"
            >
              —
            </button>
          )}

          {/* End Call Button */}
          <button
            type="button"
            onClick={handleEndCall}
            className={`${styles.headerBtn} ${styles.closeBtn} font-bold text-sm`}
            title="End Call"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className={styles.videoContainer}>
        {/* Remote video fills container */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={styles.remoteVideo}
        />

        {/* Local picture-in-picture preview */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className={styles.localVideo}
          style={{ display: isVideoCameraOff ? "none" : "block" }}
        />

        {/* Floating Controls Bar */}
        <div className={styles.controls}>
          <button
            type="button"
            onClick={toggleMuted}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition cursor-pointer ${
              isMuted ? "bg-amber-600 text-white" : "bg-slate-700/80 hover:bg-slate-600 text-white"
            }`}
            title={isMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isMuted ? "🔇" : "🎙️"}
          </button>
          <button
            type="button"
            onClick={toggleCamera}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition cursor-pointer ${
              isVideoCameraOff ? "bg-amber-600 text-white" : "bg-slate-700/80 hover:bg-slate-600 text-white"
            }`}
            title={isVideoCameraOff ? "Turn camera on" : "Turn camera off"}
          >
            {isVideoCameraOff ? "🚫" : "📹"}
          </button>
          <button
            type="button"
            onClick={handleEndCall}
            className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-sm shadow transition cursor-pointer"
            title="End call"
          >
            📞
          </button>
        </div>
      </div>

      {/* 4 Corner Resize Handles */}
      <div
        className={styles.resizeSE}
        onMouseDown={onResizeSE}
        title="Drag to resize (Bottom-Right)"
      >
        <div className={styles.gripDots} />
      </div>
      <div
        className={styles.resizeNW}
        onMouseDown={onResizeNW}
        title="Drag to resize (Top-Left)"
      />
      <div
        className={styles.resizeNE}
        onMouseDown={onResizeNE}
        title="Drag to resize (Top-Right)"
      />
      <div
        className={styles.resizeSW}
        onMouseDown={onResizeSW}
        title="Drag to resize (Bottom-Left)"
      />
    </div>
  );
}

export default VideoCall;