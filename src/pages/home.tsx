import supabase from "../server/App";
import React, { useEffect } from "react";
import gachaCard from "../assets/components/gachaCard";

function Home() {
  const [gacha, setGacha] = React.useState<any| null>(null)
  const [fetchError, setFetchError] = React.useState<String | null>(null)

  useEffect(() => {
    async function fetchGacha() {
      const { data, error } = await supabase.from('Gacha').select('*')
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

  }, [])

  return (
  <>
    <div className="mx-6 grid grid-cols-4">
      {fetchError && <p>{fetchError}</p>}
      {gacha &&
        gacha.map((item: any) => {
          return gachaCard(item)
        })
      }
    
    </div>
  </>
      )
}
      export default Home;