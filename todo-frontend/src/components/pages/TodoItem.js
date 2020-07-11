import React from "react";
import { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import { useHistory } from "react-router-dom";

export default function TodoItem(props) {

  const [text, setText] = useState(props.entryText);
  const [isEdit, setIsEdit] = useState(false);
  const { setUserData, userData, setTodoList } = useContext(UserContext);
  const history = useHistory();

  function handleChange(e) {
    setText(e.target.value);
  }

  async function removeTodo(todoId) {
    console.log(todoId);

    await Axios.delete(
      "https://nvw3ogcmv4.execute-api.ap-south-1.amazonaws.com/dev/todos/" +
        todoId,
      {
        headers: { "x-auth-token": userData.user.token }
      }
    ).then(
      response => {
        console.log(response);
        setTodoList(response.data.updated_todo_list);
      },
      error => {
        console.log(error.response.data.message);
        if (error.response.data.message === 'Invalid auth key'){
            setUserData({
                user: undefined
            })
            setTodoList([])
            localStorage.setItem('auth-token', '')
            history.push('/login')
        }
      }
    );
  }

  async function updateTodo(todoId) {
    console.log(todoId);
    const update_item = { text, title: "title" };
    await Axios.patch(
      "https://nvw3ogcmv4.execute-api.ap-south-1.amazonaws.com/dev/todos/" +
        todoId,
      update_item,
      {
        headers: { "x-auth-token": userData.user.token }
      }
    ).then(
      response => {
        console.log(response);
        setTodoList(response.data.updated_todo_list);
        setIsEdit(false)
      },
      error => {
        console.log(error.response.data.message);
        if (error.response.data.message === 'Invalid auth key'){
            setUserData({
                user: undefined
            })
            setTodoList([])
            localStorage.setItem('auth-token', '')
            history.push('/login')
        }
      }
    );
  }

  return (
    <div id={props.todoId} className="flex mb-4 items-center">
      {isEdit ? <input
        className=" text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
        value={text}
        type="text"
        onChange={handleChange}
        />:
        <p className="w-full text-grey-900">{text}</p>
      }      
    {!isEdit ? 
        <button
            onClick={() => setIsEdit(true)}
            className="flex-no-shrink p-2 ml-4 mr-2 rounded hover:text-white text-green-500 border-green-500 hover:bg-green-500"
            >Edit
        </button> : 
        <button
            onClick={() => updateTodo(props.todoId)}
            className="flex-no-shrink p-2 ml-4 mr-2 rounded hover:text-white text-green-500 border-green-500 hover:bg-green-500"
            >Update
        </button>}
      
      
      <button
            onClick={() => removeTodo(props.todoId)}
            className="flex-no-shrink p-2 ml-2 border-2 rounded text-red-500 border-red hover:text-white hover:bg-red-500"
            >Delete
      </button>
    </div>
  );
}
