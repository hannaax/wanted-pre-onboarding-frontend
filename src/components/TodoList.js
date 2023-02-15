import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { instance } from "../api/instance";

function TodoList({ todos, setTodos }) {
  const [todoEditing, setTodoEditing] = useState(null);
  const [editingText, setEditingText] = useState("");

  const deleteTodo = (id) => {
    instance
      .delete(`/todos/${id}`)
      .then((res) => {
        setTodos((todos) => todos.filter((todo) => todo.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const toggleComplete = (id, todo, isCompleted) => {
    instance
      .put(`/todos/${id}`, {
        todo: todo,
        isCompleted: !isCompleted,
      })
      .then((res) => {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === id) {
            todo.isCompleted = res.data.isCompleted;
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch((err) => console.log(err));
  };

  const submitEdits = (id, isCompleted) => {
    instance
      .put(`/todos/${id}`, {
        todo: editingText,
        isCompleted: isCompleted,
      })
      .then((res) => {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === id) {
            todo.todo = res.data.todo;
          }
          return todo;
        });
        setTodos(updatedTodos);
        setTodoEditing(null);
        setEditingText("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      {todos.map((todo) => (
        <li key={todo.id} className="todo">
          <div className="todo-item">
            <div className="todo-text">
              <input
                type="checkbox"
                className="checkbox"
                id="completed"
                checked={todo.isCompleted}
                onChange={() =>
                  toggleComplete(todo.id, todo.todo, todo.isCompleted)
                }
              />
              {todo.id === todoEditing ? (
                <input
                  data-testid="modify-input"
                  type="text"
                  onChange={(e) => setEditingText(e.target.value)}
                  defaultValue={todo.todo}
                  // value={todo?.todo}
                />
              ) : (
                <TodoText isChecked={todo.isCompleted}>{todo.todo}</TodoText>
              )}
            </div>
            <div className="todo-actions">
              {todo.id === todoEditing ? (
                <button
                  data-testid="submit-button"
                  className="btns"
                  onClick={() => {
                    submitEdits(todo.id, todo.isCompleted);
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              ) : (
                <button
                  data-testid="modify-button"
                  className="btns"
                  onClick={() => setTodoEditing(todo.id)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
              )}

              <div className="todo-actions-margin" />
              {todo.id === todoEditing ? (
                <button
                  data-testid="cancel-button"
                  className="btns"
                  onClick={() => {
                    setEditingText("");
                    setTodoEditing(null);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              ) : (
                <button
                  data-testid="delete-button"
                  className="btns"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: 500px;

  .checkbox {
    margin-right: 7px;
  }

  .btns {
    font-size: 13px;
    background-color: transparent;
    color: #222;
    border: none;
    margin: 8px 5px;
    cursor: pointer;
  }

  .todo-text {
    font-size: 17px;
    line-height: 24px;
    margin-top: 13px;
    margin-bottom: 13px;
    display: flex;
    align-items: center;
    width: 350px;
  }

  .todo-text div {
    margin-left: 8px;
  }

  .todo-text input {
    padding: 4px;
    border: solid 1px #bbb;
  }

  .todo-completed {
    display: flex;
    margin: 10px 0;
  }

  .todo-actions {
    display: flex;
  }

  .todo-item {
    display: flex;
  }

  .todo-actions-margin {
    width: 15px;
  }
`;

const TodoText = styled.span`
  text-decoration: ${(props) => (props.isChecked ? "line-through" : "none")};
  color: ${(props) => (props.isChecked ? "gray" : "#000")};
`;

export default TodoList;
