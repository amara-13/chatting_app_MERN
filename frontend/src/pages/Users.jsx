import AllUsers from "../components/Users";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import  {fetchUsers} from "../services/ChatService";
function Users(){
  const loginUserString = localStorage.getItem("user");
  const loginUser = JSON.parse(loginUserString);
  const userId = loginUser._id;
  const userEmail = loginUser.email;

 const [allUsers,setAllUsers] = useState([]);
 const fetchUser = async()=>{
    try{
        const response = await fetchUsers();
        if(response && response.data){
            const otherUsers= response.data.filter(user=>user._id!==userId);
            setAllUsers(otherUsers);
        }else{
            Swal.fire({
                title:"Failed",
                text:"Failed to fetch user list"
            });
        }
    }catch(error){
        const errorMsg = error.response?.data?.message || "Failed";
        Swal.fire({
            title:"Failed",
            text:errorMsg,
        });
    }
    }

 useEffect(()=>{
        fetchUser();
    },[userId]);







console.log(allUsers);

    return(
        
<AllUsers allUsers={allUsers}/>

    )
}
export default Users;