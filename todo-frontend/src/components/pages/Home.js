import React, { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import TodoList from "./TodoList";
import Axios from "axios";
import { useHistory } from "react-router-dom";


export default function Home() {
    const { setUserData,userData, todoList, setTodoList } = useContext(UserContext);
    console.log(todoList);

    const [text, setText] = useState();
    const history = useHistory();

    function handleChange(e) {
        setText(e.target.value);
    }

    const submit = async e => {
        e.preventDefault();
        const newTodo = { text, title: "test" };
        console.log(newTodo);
        console.log(userData);

        await Axios.post(
            "https://nvw3ogcmv4.execute-api.ap-south-1.amazonaws.com/dev/todos",
            newTodo,
            {
                headers: { "x-auth-token": userData.user.token }
            }
        ).then(
            response => {
                console.log(response.data.message);

                setTodoList([response.data, ...todoList ]);
                setText("");
            },
            error => {
                console.log(error.response.data.message);
                if (error.response.data.message === 'Invalid auth key'){
                    console.log('in if')
                    setUserData({
                        user: undefined
                    })
                    setTodoList([])
                    localStorage.setItem('auth-token', '')
                    history.push('/login')
                }
                // setError(error.response.data.message)
            }
        );
    };

    return (
        <div className="p-6 h-100 w-full flex flex-col items-center justify-center bg-gray-300">
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        <form onSubmit={submit}>
          <div className="mb-4">
            <h1 className="text-grey-900 text-2xl">Todo List</h1>
            <div className="flex mt-4">
              <input 
                required
                className="shadow appearance-none border w-full rounded py-2 px-3 mr-4 text-grey-600"
                type="text"
                placeholder="Wash dishes..."
                name="text"
                value={text}
                onChange={handleChange}                
              />
              <button
                className="flex-no-shrink p-2 ml-auto border rounded text-teal-500 border-teal-500 hover:text-white hover:bg-teal-500"
              > Add
              </button>
            </div>
          </div>
        </form>
        <div className="mt-8">
          <TodoList />
        </div>
      </div>
    </div>
    );
}
