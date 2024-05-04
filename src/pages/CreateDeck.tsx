import { useState } from "react"
import supabase from "../server/App"
import { useNavigate } from "react-router-dom"
import Navbar from "../assets/components/navbar"


function Create () {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [formError, setError] = useState<string|null>(null)
    const [info, setInfo] = useState("")
    const auth = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token')|| "null")
    const user_id = auth.user.id


    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setInfo("")
        setError("")
        
        if (!name || !description) {
            setError("Please fill out all fields")
            return
        }
        const { error } = await supabase
            .from('Decks')
            .insert([{user_id,name, description}])
        
        if (error) {
            console.log(error)
            setError("Please fill out all fields")
        }
        else{
            setError(null)
            navigate('/')
            alert("Deck updated successfully")
        }
    }

    

  return (
    <>  
        <Navbar />
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create deck</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">Title</label>
                            <div className="mt-2">
                                <input id="text" name="username" required className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                                <div className="text-sm">
                                </div>
                            </div>
                            <div className="mt-2">
                                <input required className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600" onClick={handleSubmit} >Create now!</button>
                        </div>
                    </form>
                </div>
            </div>
        {formError && <p>{formError}</p>}
        {info && <p>{info}</p>}
    </>
  );
}
export default Create;