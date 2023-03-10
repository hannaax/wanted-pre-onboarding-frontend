import { useState, useEffect } from "react";
import styled from "styled-components";
import { instance } from "../api/instance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [pwValidationState, setPwValidationState] = useState(false);
  const [emailValidationState, setEmailValidationState] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    instance
      .post("/auth/signup", userInfo)
      .then((res) => {
        if (res.status !== 201) return alert("회원가입에 실패했습니다.");
        navigate("/signin");
      })
      .catch((err) => {
        console.log(err);
        return alert("회원가입에 실패했습니다.");
      });
  };

  const emailValidation = (e) => {
    let email = e.target.value;
    setUserInfo({ ...userInfo, email: email });
    if ([...email].includes("@") && email !== "") {
      setEmailValidationState(true);
    } else {
      setEmailValidationState(false);
    }
  };

  const pwValidation = (e) => {
    let pw = e.target.value;
    setUserInfo({ ...userInfo, password: pw });
    if (pw.length >= 8) {
      setPwValidationState(true);
    } else {
      setPwValidationState(false);
    }
  };

  useEffect(() => {
    const hasToken = localStorage.getItem("token");
    if (hasToken) return navigate("/todo");
  }, [navigate]);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div>Register</div>
        <input
          data-testid="email-input"
          type="email"
          placeholder="Email"
          onChange={emailValidation}
        />
        {emailValidationState || <p>이메일은 @를 포함해야 합니다.</p>}
        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          onChange={pwValidation}
        />
        {pwValidationState || <p>비밀번호는 8자 이상입니다.</p>}
        <Button
          data-testid="signup-button"
          disabled={!(pwValidationState && emailValidationState)}
        >
          Submit
        </Button>
      </form>
      <UserCheck>
        <p>회원입니까?</p>
        <button
          onClick={() => {
            navigate("/signin");
          }}
        >
          로그인
        </button>
      </UserCheck>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f6f6f6;
  background-size: cover;
  background-position: center;

  > form {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 0 50px;
    border-radius: 10px;
  }

  > form div {
    font-size: 30px;
    font-weight: 700;
    color: #222;
    text-align: center;
    margin: 20px;
  }

  > form input {
    padding: 15px;
    margin: 10px 0px;
    border: 1px solid #aaa;
    width: 200px;
  }

  > form p {
    font-size: 12px;
    color: red;
    padding: 5px 0;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 50px;
  padding: 10px;
  border: none;
  background-color: ${(props) => (props.disabled ? "#acacac" : "#222;")};
  color: white;
  border-radius: 5px;
  font-weight: 550;
  font-size: 18px;
  cursor: pointer;
  margin-top: 25px;
  margin-bottom: 30px;
  pointer-events: ${(props) => (props.disabled ? "none" : null)};
`;

const UserCheck = styled.div`
  display: flex;
  margin: 30px;

  > p {
    margin-right: 10px;
    font-size: 13.5px;
  }

  > button {
    border: none;
    background-color: transparent;
    font-size: 13.5px;
    color: #00a2e8;
    cursor: pointer;
  }
`;

export default Register;
