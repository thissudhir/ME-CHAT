import React, { useContext, useEffect, useState } from "react";
import Messege from './Messege';
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messeges=()=>{
    const [messages, setMessages]= useState([]);
    const {data}= useContext(ChatContext);

    useEffect(()=>{
        if (data?.chatId) {
            const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
              doc.exists() && setMessages(doc.data().messages);
            });
      
            return () => {
              unSub();
            };
          }
    },[data?.chatId]);
    console.log("data:", data);

    console.log("messagwa",messages)
    return(
        <div className="messeges">
            {messages.map((m)=>(
                <Messege message={m} key={m.id}/>
            ))}
        </div>
    )
}

export default Messeges;