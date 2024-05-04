import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import supabase from "../server/App";
import Navbar from "../assets/components/navbar";

function DeckEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [formError, setError] = useState<string | null>(null)
    const [cards, setCards] = useState<any[]>([])

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token') || "null")
        const user_id = auth.user.id

        const fetchDeck = async () => {
            const { data, error } = await supabase
                .from('Decks')
                .select()
                .eq('id', id)
                .single()

            if (error) {
                console.log(error)
                navigate('/', { replace: false })
            }
            if (data) {
                console.log(data)
                if (data.user_id !== user_id) {
                    navigate('/', { replace: true })
                    return
                }
                setTitle(data.name)
                setDescription(data.description)
            }
        }

        const fetchCards = async () => {
            const { data, error } = await supabase
                .from('Cards')
                .select()
                .eq('deck_id', id)

            if (error) {
                console.log(error)
                setError('Could not fetch cards')
                return
            }
            if (data) {
                console.log("Card", data)
                setCards(data)
            }
        }

        fetchDeck()
        fetchCards()


    }, [id, navigate])





    return (
        <>
            <Navbar />
            <div className="w-[80%] lg:w-[60%] px-[4%] lg:px-[10%] pt-6">
                {/* {Breadcrum} */}
                <nav aria-label="Breadcrumb" className="pb-6">
                    <ol className="flex items-center gap-1 text-sm text-gray-600">
                        <li>
                            <a href="/" className="block transition hover:text-gray-700">
                                <span className="sr-only"> Home </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </a>
                        </li>

                        <li className="rtl:rotate-180">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </li>

                        <li>
                            <p className="block transition hover:text-gray-700"> {title} </p>
                        </li>


                    </ol>
                </nav>


            <div className="flow-root" id="detail">
                <label htmlFor="detail" className="block text-medium font-medium text-gray-900 pb-3"> Detail deck ID:{id}</label>
                <dl className="-my-3 divide-y divide-gray-100 text-sm">
                    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 ah-auto">
                        <dt className="font-medium text-gray-900 col-span-2">Title</dt>
                        <dd className="text-gray-700 sm:col-span-4">{title}</dd>
                
                    </div>

                    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 h-auto">
                        <dt className="font-medium text-gray-900 col-span-2">Description</dt>
                        <dd className="text-gray-700 sm:col-span-4">
                            {description}
                        </dd>
                             
                    </div>
                    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 h-auto">
                        <dt className="font-medium text-gray-900 col-span-2">Number of cards</dt>
                        <dd className="text-gray-700 sm:col-span-4">{cards.length}</dd>
                    </div>
                    <div className="grid grid-cols-3 py-3 sm:grid-cols-6 sm:gap-2">
                        <Link to="./edit">
                            <button className="transition shadow-md cursor-pointer transition-all duration-500 hover:translate-y-0.5 delay-50 col-span-2 border border-2 border-gray-300 hover:bg-gray-300 hover:text-white w-60 h-10 rounded col-span-1 px-2" type="submit">Edit or Add/Delete card</button>
                        </Link>
                    </div>
                    
                    
                </dl>
            </div>

            <span className="relative flex justify-center lg:pt-12">
            <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"
            ></div>

            <span className="relative z-10 bg-white px-6"></span>
          </span>
            {/*             
            <p>ID-{id}</p>
            <div className="bg-slate-400 flex w-fit rounded-md mx-10">
                <form className="grid p-5 gap-2" onSubmit={handleSubmit}>
                    <label className="grid-cols-2 gap-2">
                        Title:
                        <input type="text" className="border" defaultValue={title}  onChange={(e) => setTitle(e.target.value)}/>
                    </label>
                    <label>
                        Description:
                        <input type="text" className="border" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                    <div className="w-full grid-cols-8">
                        <button className="border border-black col-span-6" type="submit">Update</button>
                        <button onClick={handleDelete} className="border border-black col-span-2">Delete</button>
                    </div>
                    
                </form>
            </div> */}
            {formError && <p>{formError}</p>}
            <p className="font-semibold pt-10 text-3xl">
                My Deck:
            </p>
            </div>
            
        </>
    )
}
export default DeckEdit;