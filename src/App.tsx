import { useEffect, useState } from 'react'
import Navbbar from './assets/component/navbar'
import supabase from './server/App'

function App() {
  const [data, setData] = useState<any>([])
  useEffect(() => {
    console.log(supabase)
    getData()
  },[])

  async function getData() {
    const { data, error } = await supabase.from('Employee').select();
    if (error) {
      console.log('Error fetching data:', error.message)
      return
    }
    console.log(data)
    setData(data);
  }

  return (
    <>
      {Navbbar()}
    </>
  )
}

export default App
