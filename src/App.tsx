import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { useEffect, useState } from "react";

import Homepage from "./pages/Homepage";
import Create from "./pages/CreateDeck";
import DeckDetail from "./pages/DeckDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import EditDeck from "./pages/EditDeck";
import supabase from "./server/App";
import Navbbar from "./assets/components/navbar";


const isAuth4home = () => {
  const token = sessionStorage.getItem('token')
  if (token) {
    return true
  }
  return false
}

const handleLogout = () => {
  sessionStorage.removeItem('token')
  supabase.auth.signOut()
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
    {Navbbar()}
      <Routes>
        {token ? (
          <Route path="/home" element={<Homepage />} />
        ) : (
          <Route path="/login" element={<Login setToken={setToken} />} />
        )}
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<DeckDetail />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/:id/edit" element={<EditDeck />} />
        {token ? (
          <Route path="/" element={<Homepage />} />
        ) : (
          <Route path="/" element={<Login setToken={setToken} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;