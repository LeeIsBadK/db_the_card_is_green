import { Link } from "react-router-dom";

const handleLogout = () => {
    localStorage.removeItem('token')
}

function Navbbar() {
    const token = JSON.parse(localStorage.getItem('token')|| '')
    return (
        <nav className="Box w-full h-20 bg-emerald-600">
        <ul className="flex justify-center items-center h-full">
          <li className="mx-4 ">
            {token && <Link to="/" className="text-white">
              Home
            </Link>}
          </li>
          <li className="mx-4">
            {token && <Link to="/create" className="text-white">
              Create
            </Link>
            }
          </li>
          {token && <li className="mx-4"> 
            <Link to="/login" className="text-white" onClick={handleLogout}>
              Logout
            </Link>
          </li>}
        </ul>
      </nav>
    );
}
export default Navbbar;