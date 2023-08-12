import React, { useContext, useState } from "react";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import {db} from '../firebase';
import {AuthContext} from "../context/AuthContext";

const Search=()=>{

    const [userName, setUserName]= useState("");
    const [user, setUser]= useState(null);
    const [error, setError]= useState(false);

    const {currentUser}=useContext(AuthContext)


    const handleSearch= async ()=>{
        const q = query(collection(db, "users"), where("displayName", "==", userName));
        try{
            
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            });
        }catch(error){
            setError(true);
        };
    };

    const handleKey=event=>{
        event.code ==="Enter" && handleSearch();
    };
    const handleSelect= async ()=>{
        //check wheter the chat in firesite exists, if not create
        const combinedId= currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try{
            const res= await getDoc(doc(db, "chats", combinedId))

            if(!res.exists()){
                //create user chats
                await setDoc(doc(db, "chats", combinedId), {messages:[]});

                await updateDoc(doc(db, "userChats", currentUser.uid),{
                    [combinedId+".userInfo"]:{
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    }, 
                    [combinedId+".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, "userChats", user.uid),{
                    [combinedId+".userInfo"]:{
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    }, 
                    [combinedId+".date"]: serverTimestamp()
                });
            }

        } catch(error){
            console.log('chat doesnot exist')
        }
        setUser(null);
        setUserName("")
    };
    return(
        <div className="search">
            <div className="searchForm">
                <input type="text" placeholder="FInd User" onKeyDown={handleKey} onChange={event=>setUserName(event.target.value)} value={userName}/>
            </div>
            {error && <span>Usenr not found!</span>}
            { user && <div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL} alt="user image" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>}
            
           
        </div>
    )
}

export default Search;