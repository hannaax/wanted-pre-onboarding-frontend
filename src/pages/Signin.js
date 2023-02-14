import styled from "styled-components";

const Signin = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const emailValidation = () => {};

  const pwValidation = () => {};

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h1>Signin</h1>
        <input
          data-testid="email-input"
          type="email"
          placeholder="Email"
          onChange={emailValidation}
        />
        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          onChange={pwValidation}
        />
        <Button data-testid="signin-button">Submit</Button>
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
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

  > form h1 {
    color: #222;
    text-align: center;
  }

  > form label {
    font-size: 12px;
    color: gray;
  }

  > form input {
    padding: 15px;
    margin: 8px 0px;
    border: 1px solid gray;
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
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 30px;
  pointer-events: ${(props) => (props.disabled ? "none" : null)};
`;

export default Signin;
