import { useState, useEffect } from "react";
import styled from "styled-components";
import { instance } from "../api/instance";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

function Todo() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      instance.get("/todos").then((res) => {
        setTodos(res.data);
      });
    } else window.location.replace("/signin");
  }, []);

  return (
    <Container>
      <Div>
        <TodoDiv>
          <TodoForm todos={todos} setTodos={setTodos} />
          <TodoList todos={todos} setTodos={setTodos} />
        </TodoDiv>
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

const TodoDiv = styled.div`
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
`;

export default Todo;
