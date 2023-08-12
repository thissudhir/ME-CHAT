import React, { useState } from "react";
import Add from '../img/addAvatar.png'
import { auth } from "../firebase";

import {  signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Login=()=>{

    const [error, setError]=useState(false);
    const navigate =useNavigate()

    const handleSubmit=async (event)=>{
        event.preventDefault();
        const email=event.target[0].value;
        const password=event.target[1].value;



        try{
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        }catch(error){
            setError(true);
        }
    };
    return(
        <div className="formContainer">
            <div className="formeWrapper">
                <span className="logo">ME CHAT</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    
                    <input type='email' placeholder="email"/>
                    <input type='password' placeholder="password"/>
                    
                    <button>Sign in</button>
                    {error && <span>Something went wrong</span>}
                </form>
                <p>not a user? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}

export default Login;