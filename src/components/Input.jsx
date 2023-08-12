import React, { useContext, useState } from "react";
import Img from '../img/img.png';
import Attachment from '../img/attach.png';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const Input=()=>{
    const [text, setText]= useState("");
    const [image, setImage]= useState(null);
    // const [error, setError] = useState(false);

    const {currentUser}= useContext(AuthContext)
    const {data}= useContext(ChatContext)

    const handleSend= async ()=>{
        // setError(false); // Reset error state
        console.log("Send button clicked");
        console.log("currentUser:", currentUser);
        console.log("data:", data);
        if(image){
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                "state_changed",
                null,
                (error) => {
                    console.error("Error uploading image:", error);
                    // setError(true); // Set error state
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                        console.log("Download URL:", downloadURL);
                        try{

                            await updateDoc(doc(db, "chats", data?.chatId),{
                                messages: arrayUnion({
                                    id: uuid(),
                                    text,
                                    senderId: currentUser.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL,
                                }),
                            });
                            console.log("Message sent with image");
                        } catch (error){
                            alert('Failed to send message');
                        }
                    });
                }
            )
            console.log("Sent Img");

        }
        else{
            try{

                await updateDoc(doc(db, "chats", data?.chatId),{
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                    }),
                });
                console.log("Sent");
            }catch(error){
                console.error("Error sending message:", error);
            }
        }

        await updateDoc(doc(db, "userChats", currentUser.uid),{
            [data.chatId + ".lastMessage"]:{
                text
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", data.user.uid),{
            [data.chatId + ".lastMessage"]:{
                text
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("")
        setImage(null)
    };
    const handleImageChange = (event) => {
        console.log("Image selected:", event.target.files[0]);
        const selectedImage = event.target.files[0];
        setImage(selectedImage);
    };
    
    return(
        <div className="input">
            <input type="text" placeholder="type a message..." onChange={event=>setText(event.target.value)} value={text}/>
            <div className="send">
                <img src={Attachment} alt="Add file" onChange={event=>setImage(event.target.files[0])}/>
                <input type="file" id="file" onChange={handleImageChange}/>
                <label htmlFor="file">
                    <img src={Img} alt="attach image" />
                </label>
                <button onClick={handleSend}>send</button>
            </div>
        </div>
    )
}

export default Input;