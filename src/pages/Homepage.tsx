import supabase from "../server/App";
import React, { useEffect } from "react";
import deckCard from "../assets/components/decksCard";
import Navbar from "../assets/components/navbar";

function Homepage() {
  const [deck, setDeck] = React.useState<any| null>(null)
  const [fetchError, setFetchError] = React.useState<String | null>(null)
  const [orderBy, setOrderBy] = React.useState("created_at")
  const [ascending, setAscending] = React.useState(false)


  useEffect(() => {
    async function fecthDeck() {
      const local_sesion = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token')|| "null")
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
        setFetchError(null);
      }
    }
    fecthDeck()

  }, [orderBy, ascending])

  return (
    <>
      <Navbar />
      {fetchError && <p>{fetchError}</p>}
      {deck && (
        <>
          <div className="flex flex-rows px-2 gap-2 py-2">
            <p className="h-10">Order by:</p>
            <button className="bg-white hover:bg-gray-100 align-middle text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow h-auto" onClick={() => setOrderBy("created_at")}>Time Created</button>
            <button className="bg-white hover:bg-gray-100 align-middle text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow h-auto" onClick={() => setOrderBy("name")}>Name</button>
            <p>:</p>
            <button className="bg-white hover:bg-gray-100 align-middle text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow h-auto" onClick={() => setAscending(!ascending)}>{ascending?"Assending":"Dessending"}</button>
            <p>{orderBy}</p>
          </div>
          <div className="mx-[10%] grid grid-cols-4 gap-1">
            {deck.map((item: any) => {
              return deckCard(item);
            })}
          </div>
        </>
      )}
    </>
  );
}
export default Homepage;