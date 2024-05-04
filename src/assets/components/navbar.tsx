import { Link } from "react-router-dom";
import supabase from "../../server/App";
import { useState } from "react";




function Navbar() {
  const getlocal = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token') || "null")
  const ygo_back = "public\YGO-backcard.png"
  if (!getlocal) return
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const email = getlocal.user? getlocal.user.user_metadata ? getlocal.user.user_metadata.email ? getlocal.user.user_metadata.email : "null" : "null" : "null"
  const handleLogout = () => {
    supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
      <header className="bg-gradient-to-r  from-gray-300 to-rose-100">
        <div className="mx-auto flex h-16 max-w-screen-2xl w-full items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="block text-teal-600">
            <img src={ygo_back} className="w-10" alt="home"/>
          </Link>

          <div className="flex flex-1 items-center justify-end md:justify-between">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link className="text-gray-500 transition hover:text-gray-500/75" to="/create"> Create Deck </Link>
                </li>

              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <div
                  className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                  {email}
                </div>

                <button
                  className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>

              <button
                className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Toggle menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden w-full bg-gray-200 py-1">
          <nav aria-label="Global" className="block w-full">
            <ul className="flex flex-col items-start gap-1 text-sm w-full">
              <li className="w-full text-center h-10 align-baseline">
                <button className="bg-gray-100 w-full h-10 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:text-gray-600/75">home</button>
                <Link className="w-[100%] h-10 text-center item text-gray-600 transition hover:text-gray-500/75 align-baseline" to="/create"> Create Deck </Link>
              </li>

              <li className="w-full">
                <button
                  className="bg-gray-100 w-[100%] h-10 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:text-gray-600/75"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>


    //   <nav className="Box w-full h-20 bg-emerald-600">
    //   <ul className="flex justify-center items-center h-full">
    //     <li className="mx-4 ">
    //       {<Link to="/" className="text-white">
    //         Home
    //       </Link>}
    //     </li>
    //     <li className="mx-4">
    //       {<Link to="/create" className="text-white">
    //         Create
    //       </Link>
    //       }
    //     </li>
    //     {<li className="mx-4"> 
    //       <Link to="/login" className="text-white" onClick={handleLogout}>
    //         Logout
    //       </Link>
    //     </li>}
    //   </ul>
    // </nav>
  );
}
export default Navbar;