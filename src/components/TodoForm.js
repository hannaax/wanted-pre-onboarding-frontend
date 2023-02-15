import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { instance } from "../api/instance";

function TodoForm({ todos, setTodos }) {
  const [todo, setTodo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (todo) {
      instance
        .post("/todos", {
          todo: todo,
        })
        .then((res) => {
          setTodos(todos.concat(res.data));
          setTodo("");
        })
        .catch((err) => console.log(err));
    } else {
      alert("할 일을 입력해주세요.");
    }
  };

  return (
    <Container>
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
    </Container>
  );
}

const Container = styled.div`
  width: 500px;
`;

export default TodoForm;
