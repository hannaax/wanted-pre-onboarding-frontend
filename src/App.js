// page
import Register from "./pages/Register";
import Signin from "./pages/Signin";
import Todo from "./pages/Todo";

// module
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

export default App;
