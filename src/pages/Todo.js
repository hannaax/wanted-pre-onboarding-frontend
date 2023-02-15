import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { instance } from "../api/instance";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [todoEditing, setTodoEditing] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (todo) {
      instance
        .post("/todos", {
          todo: todo,
        })
        .then((res) => {
          console.log(res);
          setTodos(todos.concat(res.data));
          console.log(todos);
          setTodo("");
        })
        .catch((err) => console.log(err));
    } else {
      alert("할 일을 입력해주세요.");
    }
  };

  const deleteTodo = (id) => {
    instance
      .delete(`/todos/${id}`)
      .then((res) => {
        console.log(res);
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
        console.log(res);
        // 완료상태가 변한 todo를 todos에 넣어주고, setTodos 실행
        const updatedTodos = todos.map((todo) => {
          if (todo.id === id) {
            todo.isCompleted = res.data.isCompleted;
            console.log(todo);
          }
          return todo;
        });
        console.log(updatedTodos);
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
        console.log(res);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      instance.get("/todos").then((res) => {
        console.log(res);
        setTodos(res.data);
        console.log(res.data);
      });
    }
  }, []);

  useEffect(() => {
    const hasToken = localStorage.getItem("token");
    if (!hasToken) window.location.replace("/signin");
  }, []);

  return (
    <Container>
      <Div>
        <TodoList>
          <h1>Todolist</h1>
          <form onSubmit={handleSubmit}>
            <input
              data-testid="new-todo-input"
              type="text"
              onChange={(e) => setTodo(e.target.value)}
              value={todo}
            />
            <button
              data-testid="new-todo-add-button"
              className="addBtn"
              type="submit"
            >
              {" "}
              <FontAwesomeIcon icon={faPlus} />{" "}
            </button>
          </form>
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
                    />
                  ) : (
                    <TodoText isChecked={todo.isCompleted}>
                      {todo.todo}
                    </TodoText>
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
        </TodoList>
      </Div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Div = styled.div`
  width: 500px;
  height: 500px;
  background: #f4f4f4;
  overflow: auto;
  border-radius: 15px;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TodoText = styled.span`
  text-decoration: ${(props) => (props.isChecked ? "line-through" : "none")};
  color: ${(props) => (props.isChecked ? "gray" : "#000")};
`;

const TodoList = styled.div`
  width: 500px;

  h1 {
    text-align: center;
    margin: 20px 0;
  }

  form {
    width: 400px;
    display: flex;
    margin-left: 50px;
    margin-bottom: 30px;
  }

  form input {
    padding: 4px 8px;
    flex-grow: 1;
    margin-right: 16px;
  }

  .todo {
    border-bottom: 1px solid #bcbcbc;
    display: flex;
    flex-direction: column;
    padding: 5px 20px;
    margin: 0 20px 0 30px;
    width: 400px;
  }

  .addBtn {
    font-size: 16px;
    background-color: #222;
    color: #fff;
    border-radius: 8px;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    height: 45px;
  }

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

export default Todos;
