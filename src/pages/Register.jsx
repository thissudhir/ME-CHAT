import React, {useState} from "react";
import Add from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage,db } from "../firebase";
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";


const Register=()=>{
    const [error, setError]=useState(false);
    const navigate =useNavigate()

    const handleSubmit=async (event)=>{
        event.preventDefault();
        console.log(event.target[0].value)
        const displayName=event.target[0].value;
        const email=event.target[1].value;
        const password=event.target[2].value;
        const file=event.target[3].files[0];



        try{

            const res= await createUserWithEmailAndPassword(auth, email, password)

            const storageRef = ref(storage, displayName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            
            uploadTask.on(
            (error) => {
                setError(true);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                await updateProfile(res.user,{
                    displayName,
                    photoURL : downloadURL,
                })
                await setDoc(doc(db, "users", res.user.uid),{
                    uid: res.user.uid,
                    displayName,
                    email,
                    photoURL : downloadURL,
                });
                await setDoc(doc(db, "userChats", res.user.uid),{});
                navigate("/");
            });
            }
            );
        }catch(error){
            setError(true);
        }
        // .then((userCredential) => {
        //     // Signed in 
        //     const user = userCredential.user;
        //     console.log(user)
        //     // ...
        // })
        // .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     // ..
        // });
    };

    return(
        <div className="formContainer">
            <div className="formeWrapper">
                <span className="logo">ME CHAT</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type='text' placeholder="display name"/>
                    <input type='email' placeholder="email"/>
                    <input type='password' placeholder="password"/>
                    <input type='file' id="file"/>
                    <label htmlFor="file"><img src={Add}></img><span>Add an avatar</span></label>
                    <button>Sign up</button>
                    {error && <span>Something went wrong.</span>}
                </form>
                <p>already a user? <Link to="/login">login</Link></p>
            </div>
        </div>
    )
}

export default Register;