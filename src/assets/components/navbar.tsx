import { Link } from "react-router-dom";
import supabase from "../../server/App";




function Navbar() {
  const handleLogout = () => {
    supabase.auth.signOut()
  }

    return (
        <nav className="Box w-full h-20 bg-emerald-600">
        <ul className="flex justify-center items-center h-full">
          <li className="mx-4 ">
            {<Link to="/" className="text-white">
              Home
            </Link>}
          </li>
          <li className="mx-4">
            {<Link to="/create" className="text-white">
              Create
            </Link>
            }
          </li>
          {<li className="mx-4"> 
            <Link to="/login" className="text-white" onClick={handleLogout}>
              Logout
            </Link>
          </li>}
        </ul>
      </nav>
    );
}
export default Navbar;