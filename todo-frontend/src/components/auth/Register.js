import React, { useState , useContext} from 'react'
import { useHistory } from "react-router-dom";
import UserContext from '../../context/UserContext'

import Axios from 'axios';

export default function Register() {

    const { setUserData } = useContext(UserContext)

    const [first_name, setFirstName] = useState()
    const [last_name, setLastName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        const newUser = {first_name, last_name, email, password}
        await Axios.post(
            "https://nvw3ogcmv4.execute-api.ap-south-1.amazonaws.com/dev/user/signup",
            newUser
        ).then((response) => {
            console.log(response);
            setUserData({
                user: response.data,
            });
            localStorage.setItem("auth-token", response.data.token);
            history.push('./');
        }, (error) => {
            console.log(error.response.data.message);
            setError(error.response.data.message)
        }); 
    }

    return (
        <div className="container max-w-full mx-auto py-16 px-6">
        <div className="font-sans">
        <div className="max-w-sm mx-auto px-6">
          <div className="relative flex flex-wrap">
            <div className="w-full relative">
              <div className="mt-6">
                 
                <div className="text-6xl text-center font-semibold text-black">
                  Register
                </div>
                {error ?<div className="py-6 text-center">
                    <p className="inline-block text-sm text-red-600 align-centre">
                      {error}
                    </p>
                  </div>:<></>}
                <form className="mt-8" onSubmit={submit}>
                  <div className="mx-auto max-w-lg">
                    <div className="py-2">
                      <span className="px-1 text-sm text-gray-600">First Name</span>
                      <input type="text" required
                          onChange={(e) => setFirstName(e.target.value)}
                        className="text-md block px-3 py-2  rounded-lg w-full 
                      bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"/>
                    </div>
                    <div className="py-2">
                      <span className="px-1 text-sm text-gray-600">Last Name</span>
                      <input type="text" required
                          onChange={(e) => setLastName(e.target.value)}
                        className="text-md block px-3 py-2  rounded-lg w-full 
                      bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"/>
                    </div>
                    <div className="py-2">
                      <span className="px-1 text-sm text-gray-600">Email</span>
                      <input id="login-email"
                          type="email" required
                          onChange={(e) => setEmail(e.target.value)}
                        className="text-md block px-3 py-2  rounded-lg w-full 
                      bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"/>
                    </div>
                    <div className="py-2" x-data="{ show: true }">
                      <span className="px-1 text-sm text-gray-600">Password</span>
                      <div className="relative">
                        <input type="password"
                          onChange={(e) => setPassword(e.target.value)} className="text-md block px-3 py-2 rounded-lg w-full 
                      bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md
                      focus:placeholder-gray-500
                      focus:bg-white 
                      focus:border-gray-600  
                      focus:outline-none"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">      
                        </div>
                      </div>
                    </div>
                    
                   <button className="mt-3 text-lg font-semibold 
                      bg-gray-800 w-full text-white rounded-lg
                      px-6 py-3 block shadow-xl hover:text-white hover:bg-black">
                      Register
                    </button>
                  </div>
                </form>        
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
}
