import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./server/App";

import Homepage from "./pages/Homepage";
import Create from "./pages/Create";
import Update from "./pages/Update";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

const isAuth4home = () => {
  const token = sessionStorage.getItem('token')
  if (token) {
    return true
  }
  return false
}

function handleLogout() {
  supabase.auth.signOut();
  sessionStorage.removeItem("token");
  window.location.reload();
}

function App() {
  const [token, setToken] = useState(false)

  if (token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }
  useEffect(() => {
    if (token) {
      isAuth4home()
    }
  }, [token]) // Add a closing parenthesis here
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
          {isAuth4home() && <li className="mx-4 text-white">
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>}
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