import supabase from "../server/App";
import React, { useEffect } from "react";
import deckCard from "../assets/components/decksCard";
import Navbar from "../assets/components/navbar";
import { Link } from "react-router-dom";

function Home() {
  const [deck, setDeck] = React.useState<any | null>(null)
  const [fetchError, setFetchError] = React.useState<String | null>(null)
  const [orderBy, setOrderBy] = React.useState("created_at")
  const [ascending, setAscending] = React.useState(false)
  const [numDecks, setNumDecks] = React.useState(0)


  useEffect(() => {
    async function fecthDeck() {
      const local_sesion = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token') || "null")
      const id = local_sesion.user.id
      if (!id) {
        window.location.href = '/login'
      }

      const { data, error } = await supabase
        .from('Decks')
        .select('*')
        .filter('user_id', 'eq', id)
        .order(orderBy, { ascending: ascending });

      if (error) {
        console.log(error);
        setFetchError("Could not fetch Deck");
        return;
      }
      if (data) {
        setDeck(data);
        setNumDecks(data.length);
        setFetchError(null);
      }
    }
    fecthDeck()

  }, [orderBy, ascending])

  return (
    <>
      <Navbar />
      {fetchError && <p>{fetchError}</p>}
      <header className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Your decks Here!</h1>

              <p className="mt-1.5 text-sm text-gray-500">Let's fun with duel 🎉</p>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <Link to="/create" className="w-[100%]">
                <button
                  className="block rounded-lg align-middle w-full border-teal-600 border-2 px-10 text-sm font-medium text-teal-600 hover:text-white transition hover:bg-teal-600 focus:outline-none focus:ring h-10"
                  type="button"
                >
                  Create Deck
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {deck && (
        <>
          {/* sort section*/}
          < div className="flex flex-rows px-2 gap-2 py-8 px-[2%] lg:px-[10%]" >
            <div>
              <label htmlFor="HeadlineAct" className="block text-sm font-medium text-gray-900"> Sort by </label>
              <select
                name="HeadlineAct"
                id="HeadlineAct"
                className="mt-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value="created_at">Time Created</option>
                <option value="name">Name</option>

              </select>
            </div>
            <div>
              <button className="bg-white hover:bg-gray-100 align-middle text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow h-auto" onClick={() => setAscending(!ascending)}>{ascending ? "Assending" : "Dessending"}</button>
            </div>
          </div>
          {/* divider section*/}
          <span className="relative flex justify-center">
            <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"
            ></div>

            <span className="relative z-10 bg-white px-6">Result {numDecks} {numDecks <= 1 ? "deck" : "decks"}</span>
          </span>
          {/* list of decks section*/}
          <div className="pt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 px-[2%] lg:px-[10%]">
            {deck.map((item: any) => {
              return deckCard(item);
            })}
          </div>
        </>
      )}
    </>
  );
}
export default Home;