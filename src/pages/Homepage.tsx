import supabase from "../server/App";
import React, { useEffect } from "react";
import gachaCard from "../assets/components/gachaCard";


function Homepage() {
  const [gacha, setGacha] = React.useState<any| null>(null)
  const [fetchError, setFetchError] = React.useState<String | null>(null)
  const [orderBy, setOrderBy] = React.useState("created_at")

  useEffect(() => {
    async function fetchGacha() {
      const { data, error } = await supabase
      .from('Gacha')
      .select('*')
      .order(orderBy, {ascending: false})

      if (error) {
        setFetchError("Could not fetch Gacha")
        return
      }
      if (data) {
        setGacha(data)
        setFetchError(null)
      }
    }
    fetchGacha()

  }, [orderBy])

  return (
    <>
      {fetchError && <p>{fetchError}</p>}
      {gacha && (
        <>
          <div className="flex flex-rows px-2 gap-2">
            <p>Order by:</p>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => setOrderBy("created_at")}>Time Created</button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => setOrderBy("title")}>Title</button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => setOrderBy("amount")}>Amount</button>
            <p>{orderBy}</p>
          </div>
          <div className="mx-6 grid grid-cols-4">
            {gacha.map((item: any) => {
              return gachaCard(item);
            })}
          </div>
        </>
      )}
    </>
  );
}
export default Homepage;