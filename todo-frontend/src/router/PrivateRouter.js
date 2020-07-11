import React, {useContext} from 'react'
import UserContext from "../context/UserContext";
import { Route } from "react-router-dom";
import Login from '../components/auth/Login'


export default function PrivateRouter({ component, ...options }) {

    const { userData } = useContext(UserContext);

    console.log('router')

    const finalComponent = userData.user ? component : Login;

    return <Route {...options} component={finalComponent} />
}
