import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { useState } from "react";

import Homepage from "./pages/Homepage";
import Create from "./pages/Create";
import Update from "./pages/Update";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState(false)

  if (token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }
  return (
    <BrowserRouter>
      <nav className="Box w-full h-20 bg-emerald-600">
        <ul className="flex justify-center items-center h-full">
          <li className="mx-4 ">
            <Link to="/home" className="text-white">
              Home
            </Link>
          </li>
          <li className="mx-4">
            <Link to="/create" className="text-white">
              Create
            </Link>
          </li>
        </ul>
      </nav>
      <Routes>
        {token?<Route path="/home" element={<Homepage />} />:<Route path="/login" element={<Login setToken={setToken}/>} />}
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setToken={setToken}/>} />
        {token?<Route path="/" element={<Homepage />} />:<Route path="/" element={<Login setToken={setToken}/>} />}
      </Routes>
    </BrowserRouter>
  );
}
export default App;