import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const Messege=({ message })=>{
    const {currentUser}= useContext(AuthContext);
    const {data}= useContext(ChatContext);

    const ref = useRef();

    useEffect(()=>{
        ref.current?.scrollIntoView({behavior: "smooth"})
    },[message]);


    if (!message) {
        // Return null or some placeholder if message is not available
        return null;
    }

    const isCurrentUserMessage = message.senderId === currentUser.uid;
    console.log("mess",message)
    return(
        <div ref={ref} className={`messege ${isCurrentUserMessage && "owner"}`}>
            <div className="messegeInfo">
                <img src={isCurrentUserMessage ? currentUser.photoURL : data.user.photoURL} />
                <span>just now</span>
            </div>
            <div className="messegeContent">
                <p>{message.text}</p>
                {message.img && <img src={message.img}alt="avatar image" />}
            </div>
        </div>
    )
}

export default Messege;