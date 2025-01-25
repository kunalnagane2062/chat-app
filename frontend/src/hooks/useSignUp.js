import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useSignUp = () => {
  
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const signup = async({fullName,username,password,confirmPassword,gender}) =>{
        const success = handleInputError({fullName,username,password,confirmPassword,gender})
        if(!success) return;

        setLoading(true)
        
        try {

            const res = await fetch("/api/auth/signup",{
                method : "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({fullName,username,password,confirmPassword,gender}),
            })

            // console.log(res);
            // console.log("Content-Type:", res.headers.get("Content-Type"));
            // console.log("Response Body:", await res.text()); // Read as plain text to debug


            const data = await res.json()
            if (data.error) {
				throw new Error(data.error);
			}
            toast.success("Signup successful!");

            //local Storage user saving
            localStorage.setItem("chat-user",JSON.stringify(data))
            //context
            setAuthUser(data);
            
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return {loading,signup};

}

export default useSignUp


function handleInputError({fullName,username,password,confirmPassword,gender}){

    if(!fullName || !username || !password || !confirmPassword || !gender){
        toast.error('Please fill in all fiels')
        return false
    }

    if(password !== confirmPassword){
        toast.error('Passwords dont match')
        return false
    }

    if(password.length < 6){
        toast.error("Password must be atleast 6 characters")
        return false
    }

    return true
}