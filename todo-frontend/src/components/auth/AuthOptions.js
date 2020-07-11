import React, { useContext } from 'react'
import { useHistory } from "react-router-dom";
import UserContext from '../../context/UserContext'

export default function AuthOptions() {

    const { userData, setUserData, setTodoList } = useContext(UserContext)

    const history = useHistory();

    const register = () => history.push('/register');
    const login = () => history.push('/login');
    const home = () => history.push('/');
    const logout = () => {
        setUserData({
            user: undefined
        })
        setTodoList([])
        localStorage.setItem('auth-token', '')
        history.push('/login')
    }

    return (

        userData.user ? (
            <React.Fragment>
                <p className="py-2 px-2 text-sm text-gray-800 font-bold md:mx-2">Logged in as {userData.user.first_name}</p>
                <button className="py-2 px-2 text-sm text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium md:mx-2" onClick={home} > Home </button>
                <button className="py-2 px-2 text-sm text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium md:mx-2" onClick={logout} > Logout </button>
            </React.Fragment>
        ) : (
                <>
                    <button className="py-2 px-2 text-sm text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium md:mx-2" onClick={login} > Login </button>
                    <button className="py-2 px-2 text-sm text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium md:mx-2" onClick={register} > Register </button>
                </>
            )
    )
}
