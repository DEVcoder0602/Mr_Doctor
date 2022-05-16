import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./Components/Home";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";

function App() {
  const user = false;
  return (
    // <Home/>
    // <Register/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" exact element={user ? <Home /> : <Login />} />
        <Route
          path="/register"
          exact
          element={user ? <Home /> : <Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
