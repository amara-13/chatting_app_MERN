import AllUsers from "../components/Users";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { socket } from "../socket";
import {
  fetchUsers,
  sendFriendRequestApi,
  getPendingRequestsApi,
  cancelFriendRequestApi,
  acceptFriendRequestApi,
  rejectFriendRequestApi,
  getFriendApi,
  unFriendRequestApi
} from "../services/ChatService";
function Users() {
  const loginUserString = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  let loginUser = null;
  try {
    if (loginUserString) loginUser = JSON.parse(loginUserString);
  } catch (err) {
    console.error("Failed to parse user", err);
  }
  const userId = loginUser?.id || loginUser?._id;
  const userEmail = loginUser?.email;


  const [allUsers, setAllUsers] = useState([]);
  const [allPendingRequest, setAllPendingRequest] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await fetchUsers();
      if (response) {
        const otherUsers = response.data.filter(user => user._id !== userId);
        setAllUsers(otherUsers);
      } else {
        Swal.fire({
          title: "Failed",
          text: "Failed to fetch user list"
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed";
      Swal.fire({
        title: "Failed",
        text: errorMsg,
      });
    }
  }

  const handlePendingRequest = async () => {
    try {
      const response = await getPendingRequestsApi(token);
      if (response && response.requests) {
        setAllPendingRequest(response.requests);
      }
    } catch (error) {
      console.log("Failed to fetch pending requests:", error.message);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await getFriendApi(token);
      if (response && response.friendships) {
        setFriendsList(response.friendships);
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
      handlePendingRequest();
      fetchFriends();

      const registerUser = () => {
        socket.emit("user-connected", userId);
      };

      if (socket.connected) {
        registerUser();
      }
      socket.on("connect", registerUser);

      // Listen for real-time friend updates
      const handleFriendUpdate = () => {
        handlePendingRequest();
        fetchFriends();
      };

      socket.on("friend-request-received", handleFriendUpdate);
      socket.on("friend-request-updated", handleFriendUpdate);

      return () => {
        socket.off("connect", registerUser);
        socket.off("friend-request-received", handleFriendUpdate);
        socket.off("friend-request-updated", handleFriendUpdate);
      };
    }
  }, [userId]);

  const handleSendRequest = async (receiver) => {
    const data = {
      receiver: receiver
    };
    try {
      const response = await sendFriendRequestApi(data, token);
      if (response) {
        await handlePendingRequest();
        // Notify the recipient in real time
        socket.emit("friend-request-sent", {
          senderId: userId,
          receiverId: receiver
        });
        Swal.fire({
          title: "Success",
          text: "Friend request sent successfully",
          icon: "success"
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send friend request";
      Swal.fire({
        title: "Failed",
        text: errorMsg,
        icon: "error"
      });
    }
  };

  const handleCancelRequest = async (requestedId, targetUserId) => {
    try {
      const response = await cancelFriendRequestApi({ requestId: requestedId }, token);
      if (response) {
        await handlePendingRequest();
        if (targetUserId) {
          socket.emit("friend-request-action", { targetUserId });
        }
        Swal.fire({
          title: "Cancelled",
          text: "Friend request cancelled successfully",
          icon: "success"
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to cancel the request";
      Swal.fire({
        title: "Failed",
        text: errorMsg,
        icon: "error"
      });
    }
  };

  const handleAcceptRequest = async (requestId, targetUserId) => {
    try {
      const response = await acceptFriendRequestApi({ requestId }, token);
      if (response) {
        await handlePendingRequest();
        await fetchFriends();
        if (targetUserId) {
          socket.emit("friend-request-action", { targetUserId });
        }
        Swal.fire({
          title: "Accepted",
          text: "Friend request accepted successfully",
          icon: "success"
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to accept friend request";
      Swal.fire({
        title: "Failed",
        text: errorMsg,
        icon: "error"
      });
    }
  };

  const handleRejectRequest = async (requestId, targetUserId) => {
    try {
      const response = await rejectFriendRequestApi({ requestId }, token);
      if (response) {
        await handlePendingRequest();
        if (targetUserId) {
          socket.emit("friend-request-action", { targetUserId });
        }
        Swal.fire({
          title: "Rejected",
          text: "Friend request rejected successfully",
          icon: "success"
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to reject friend request";
      Swal.fire({
        title: "Failed",
        text: errorMsg,
        icon: "error"
      });
    }
  };

  const handleUnfriend = async (requestId, targetUserId) => {
    try {
      const response = await unFriendRequestApi({ requestId }, token);
      if (response) {
        await fetchFriends();
        if (targetUserId) {
          socket.emit("friend-request-action", { targetUserId });
        }
        Swal.fire({
          title: "Success",
          text: "Unfriended successfully",
          icon: "success"
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to unfriend";
      Swal.fire({
        title: "Failed",
        text: errorMsg,
        icon: "error"
      });
    }
  };


  return (
    <AllUsers allUsers={allUsers}
      handleSendRequest={handleSendRequest}
      allPendingRequest={allPendingRequest}
      friendsList={friendsList}
      userId={userId}
      handleCancelRequest={handleCancelRequest}
      handleAcceptRequest={handleAcceptRequest}
      handleRejectRequest={handleRejectRequest}
      handleUnfriend={handleUnfriend}
    />
  );
}

export default Users;