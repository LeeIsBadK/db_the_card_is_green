import supabase from "../server/App";
import React, { useEffect } from "react";
import deckCard from "../assets/components/decksCard";

function Homepage({ token }: any) {
  const [deck, setDeck] = React.useState<any| null>(null)
  const [fetchError, setFetchError] = React.useState<String | null>(null)
  const [orderBy, setOrderBy] = React.useState("created_at")
  const [ascending, setAscending] = React.useState(false)


  useEffect(() => {
    async function fecthDeck() {
      const { data, error } = await supabase
        .from('Decks')
        .select('*')
        .filter('user_id', 'eq', token.user.id)
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
      {fetchError && <p>{fetchError}</p>}
      {deck && (
        <>
          <div className="flex flex-rows px-2 gap-2">
            <p>Order by:</p>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow h-8" onClick={() => setAscending(!ascending)}>{ascending?"Assending":"Dessending"}</button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow h-8" onClick={() => setOrderBy("created_at")}>Time Created</button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow h-8" onClick={() => setOrderBy("name")}>Name</button>
            <p>{orderBy}</p>
          </div>
          <div className="mx-6 grid grid-cols-4 gap-1">
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