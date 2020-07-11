import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { todoList } = useContext(UserContext);

  return (
    <>
      {todoList &&
        todoList.map(({ todo_id, text }) => (
          <TodoItem
            key={todo_id}
            todoId={todo_id}
            entryText={text}
          />
        ))}
      {todoList.length === 0 && (
        <p className="w-full text-grey-900">Please add Todo</p>
      )}
    </>
  );
}