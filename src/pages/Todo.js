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
  const [todoEditing, setTodoEditing] = useState(null); // todoEditing의 역할을 모르겠다
  const [editingText, setEditingText] = useState("");
  // -----local-storage 시작-----
  // 작동 안됨
  // edit 기능과 useEffect를 통한 local-storage 기능에 대해 더 알아보기
  useEffect(() => {
    const temp = localStorage.getItem("todos");
    const loadedTodos = JSON.parse(temp);

    if (loadedTodos) {
      setTodos(loadedTodos);
    }
  }, []);

  useEffect(() => {
    const temp = JSON.stringify(todos);
    localStorage.setItem("todos", temp);
  }, [todos]);
  // -----local-storage 끝-----

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTodo = {
      id: new Date().getTime(),
      todo: todo,
      isCompleted: todo.completed,
    };

    // setTodos([...todos].concat(newTodo));
    // setTodo("");

    if (todo) {
      instance
        .post("/todos", {
          todo: todo,
        })
        .then((res) => {
          console.log(res);
          setTodos(todos.concat(newTodo));
          setTodo("");
        })
        .catch((err) => console.log(err));
    } else {
      alert("할 일을 입력해주세요.");
    }
  };

  const deleteTodo = (id) => {
    const updatedTodo = todos.filter((todo) => todo.id !== id);
    console.log(todos);
    setTodos(updatedTodo);
    instance
      .delete(`/todos/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        console.log(todo);
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const submitEdits = (id, isCompleted) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.todo = editingText;
      }
      return todo;
    });
    setTodos(updatedTodos);
    setTodoEditing(null);
    setEditingText("");
    instance
      .put(`/todos/${id}`, {
        todo: editingText,
        isCompleted: isCompleted,
      })
      .then((res) => {
        console.log(res);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      instance.get("/todos").then((res) => {
        console.log(res);
        setTodos(res.data);
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
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  {todo.id === todoEditing ? (
                    <input
                      data-testid="modify-input"
                      type="text"
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                  ) : (
                    // <div>{todo.todo}</div>
                    <TodoText isChecked={todo.completed}>{todo.todo}</TodoText>
                  )}
                </div>
                <div className="todo-actions">
                  {todo.id === todoEditing ? (
                    <>
                      <button
                        data-testid="submit-button"
                        className="btns"
                        onClick={() => submitEdits(todo.id, todo.isCompleted)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    </>
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
  /* margin: 60px auto; */
  height: 500px;
  background: #f4f4f4;
  overflow: auto;
  border-radius: 15px;
  padding-bottom: 10px;
  /* box-shadow: 10px 10px 10px rgb(183, 183, 183); */

  /* > div h1 {
    text-align: center;
  } */
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
    /* border-radius: 8px; */
    border: none;
    margin: 8px 5px;
    cursor: pointer;
    /* height: 45px; */
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
