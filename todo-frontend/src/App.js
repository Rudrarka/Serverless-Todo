import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/pages/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import PrivateRouter from './router/PrivateRouter'
import UserContext from './context/UserContext'
import Axios from "axios";

function App() {

  const [todoList, setTodoList] = useState([])
  const [userData, setUserData] = useState({
    user: undefined
  })


  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token')
      console.log(token)
      if (token) {
        console.log(token+'============')
        await Axios.post(
          'https://nvw3ogcmv4.execute-api.ap-south-1.amazonaws.com/dev/user/verify_token',
          {},
          {
            headers: { "x-auth-token": token }
          }
        ).then((response) => {
          console.log(response);
          setUserData({
            user: response.data.user,
          });
          setTodoList(response.data.todo_list)
        }, (error) => {
          console.log(error.response.data.message);
        });
      };
    }
    checkLoggedIn()
  }, [])

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userData, setUserData, todoList, setTodoList }}>
        <Header />
        <Switch>
          <PrivateRouter exact path="/" component={Home} />
          <PrivateRouter path="/index.html" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
        <Footer />
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
