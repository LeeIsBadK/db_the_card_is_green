import { useState } from 'react'
import './App.css'
import Navbbar from './assets/component/navbar'

import supabase from './server/App'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {console.log(supabase)}
      {Navbbar()}
      <div>
        
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
          dadadada
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
