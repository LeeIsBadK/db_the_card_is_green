import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import supabase from "../server/App";
import Navbar from "../assets/components/navbar";
import Footer from "../assets/components/footer";

import { toPng } from 'html-to-image';
import React from "react";

function DeckDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState<any[]>([]);
    const [monsterCards, setMonsterCards] = useState<any[]>([]);
    const [spellCards, setSpellCards] = useState<any[]>([]);
    const [trapCards, setTrapCards] = useState<any[]>([]);
    const [cardViews, changeTableView] = useState("card");

    const [monsterFilter, setMonsterFilter] = useState<any[]>([]);
    const [monsterFiled, setMonsterFiled] = useState<any[]>([]);

    const [spellFilter, setSpellFilter] = useState<any[]>([]);
    const [spellFiled, setSpellFiled] = useState<any[]>([]);

    const [trapFilter, setTrapFilter] = useState<any[]>([]);
    const [trapFiled, setTrapFiled] = useState<any[]>([]);


    const [expandedCardId, setExpandedCardId] = useState<any | null>(null);




    let ref = React.useRef<HTMLDivElement>(null)

    const download_img = React.useCallback(() => {
        console.log("ref", ref);
        if (ref.current === null) {
            return
        }

        toPng(ref.current, { cacheBust: true, backgroundColor: 'white' })
            .then((dataUrl) => {
                console.log("ref", ref.current);
                const link = document.createElement('a')
                link.download = `${title} deck.png`
                link.target = '_blank'
                link.href = dataUrl
                setTimeout(() => {
                    link.click()
                }, 500);
            })
            .catch((err) => {
                console.log(err)
            })
    }, [ref])


    function handleFilterTrap(type: string) {

        if (trapFiled.includes(type)) {
            const index = trapFiled.indexOf(type);
            trapFiled.splice(index, 1);
            setTrapFiled(trapFiled);
        } else {
            trapFiled.push(type);
            setTrapFiled(trapFiled);
        }

        const filtered = trapCards.filter((card) => {
            if (trapFiled.includes(card.Cards.Trap[0].race)) {
                return card;
            }
            if (trapFiled.length === 0) {
                return card;
            }
        });
        setTrapFilter(filtered);
    }

    function handleFilterSpell(type: string) {
        if (spellFiled.includes(type)) {
            const index = spellFiled.indexOf(type);
            spellFiled.splice(index, 1);
            setSpellFiled(spellFiled);
        } else {
            spellFiled.push(type);
            setSpellFiled(spellFiled);
        }

        const filtered = spellCards.filter((card) => {
            if (spellFiled.includes(card.Cards.Spell[0].race)) {
                return card;
            }
            if (spellFiled.length === 0) {
                return card;
            }
        });

        setSpellFilter(filtered);

    }

    function renderSpellFilterZone() {
        const spellTypes = ["Continuous", "Equip", "Field", "Normal", "Quick-Play", "Ritual"];

        return (
            <div className="relative">
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                    <summary
                        className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
                    >
                        <span className="text-sm font-medium"> Spell Filter </span>
                        <span className="transition group-open:-rotate-180">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                    </summary>

                    <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                        <div className="w-96 rounded border border-gray-200 bg-white">
                            <ul className="space-y-1 border-t border-gray-200 p-4">
                                {spellTypes.map((type) => (
                                    <li key={`spell-${type}`}>
                                        <label htmlFor={`spell-${type}`} className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`spell-${type}`}
                                                className="size-5 rounded border-gray-300"
                                                onClick={() => handleFilterSpell(type)}
                                            />
                                            <span className="text-sm font-medium text-gray-700"> {type} </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </details>
            </div>
        );
    }

    function renderTrapFilterZone() {
        const trapTypes = ["Continuous", "Counter", "Normal"];

        return (
            <div className="relative">
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                    <summary
                        className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
                    >
                        <span className="text-sm font-medium"> Trap Filter </span>
                        <span className="transition group-open:-rotate-180">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                    </summary>

                    <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                        <div className="w-96 rounded border border-gray-200 bg-white">
                            <ul className="space-y-1 border-t border-gray-200 p-4">
                                {trapTypes.map((type) => (
                                    <li key={`trap-${type}`}>
                                        <label htmlFor={`trap-${type}`} className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`trap-${type}`}
                                                className="size-5 rounded border-gray-300"
                                                onClick={() => handleFilterTrap(type)}
                                            />
                                            <span className="text-sm font-medium text-gray-700"> {type} </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </details>
            </div>
        );
    }




    function handleFilterAttribute(r: string) {
        r = r.toLocaleUpperCase();
        console.log("r", r);
        console.log("monsterFiled", monsterFiled);
        console.log(monsterFiled.includes(r))
        if (monsterFiled.includes(r)) {
            const index = monsterFiled.indexOf(r);
            monsterFiled.splice(index, 1);
            setMonsterFiled(monsterFiled);
        }
        else {
            monsterFiled.push(r);
            setMonsterFiled(monsterFiled);
        }
        console.log("monsterFiled", monsterFiled);
        const filtered = monsterCards.filter((card) => {
            if (monsterFiled.includes(card.Cards.Monster[0].attribute)) {
                return card;
            }
            if (monsterFiled.length === 0) {
                return card;
            }

        });
        console.log("filtered", filtered);
        setMonsterFilter(filtered);
    }

    function handleFilterRank(v: string) {
        var r = parseInt(v);
        console.log("r", r);
        console.log("monsterFiled", monsterFiled);
        console.log(monsterFiled.includes(r))
        if (monsterFiled.includes(r)) {
            const index = monsterFiled.indexOf(r);
            monsterFiled.splice(index, 1);
            setMonsterFiled(monsterFiled);
        }
        else {
            monsterFiled.push(r);
            setMonsterFiled(monsterFiled);
        }
        console.log("monsterFiled", monsterFiled);
        const filtered = monsterCards.filter((card) => {
            if (monsterFiled.includes(card.Cards.Monster[0].level)) {
                return card;
            }
            if (monsterFiled.length === 0) {
                return card;
            }

        });
        console.log("filtered", filtered);
        setMonsterFilter(filtered);
    }

    function filterCardZone() {
        const race = ["Light", "Dark", "Water", "Fire", "Wood", "Earth", "Lightning", "Wind"]
        const rank = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
        return (
            <div className="">
                <div className="relative">
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                        <summary
                            className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
                        >
                            <span className="text-sm font-medium"> Filter </span>

                            <span className="transition group-open:-rotate-180">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </summary>

                        <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                            <div className="w-96 rounded border border-gray-200 bg-white">
                                <header className="flex items-center justify-between p-4">
                                    <span className="text-sm text-gray-700"> {monsterFiled.length} Selected </span>

                                    <button type="button" className="text-sm text-gray-900 underline underline-offset-4" onClick={() => {
                                        setMonsterFiled([]);
                                        setMonsterFilter(monsterCards);
                                        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                                        checkboxes.forEach((checkbox) => {
                                            const inputCheckbox = checkbox as HTMLInputElement;
                                            if (inputCheckbox.checked) inputCheckbox.checked = false;
                                        });
                                    }}>
                                        Reset
                                    </button>
                                </header>
                                <ul className="space-y-1 border-t border-gray-200 p-4">
                                    {race.map((e) => {
                                        return (
                                            <li key={`${e}Att`}>
                                                <label htmlFor="FilterInStock" className="inline-flex items-center gap-2">
                                                    <input type="checkbox" className="size-5 rounded border-gray-300" onClick={() => handleFilterAttribute(e)} />

                                                    <span className="text-sm font-medium text-gray-700"> {e} </span>
                                                </label>
                                            </li>

                                        )
                                    })}
                                </ul>
                                <ul className="space-y-1 border-t border-gray-200 p-4">
                                    {
                                        rank.map((e) => {
                                            return (
                                                <li key={`${e}rank`}>
                                                    <label htmlFor="FilterInStock" className="inline-flex items-center gap-2">
                                                        <input type="checkbox" id="FilterInStock" className="size-5 rounded border-gray-300" onClick={() => handleFilterRank(e)} />

                                                        <span className="text-sm font-medium text-gray-700"> {e} </span>
                                                    </label>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        )
    }



    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const auth = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token') || "null");
                const user_id = auth.user.id;

                const { data, error } = await supabase
                    .from('Decks')
                    .select()
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error(error);
                    navigate('/', { replace: false });
                    return;
                }

                if (data) {
                    if (data.user_id !== user_id) {
                        navigate('/', { replace: true });
                        return;
                    }

                    setTitle(data.name);
                    setDescription(data.description);
                    console.log("data", data);

                    const { data: fetchedCards, error: cardError } = await supabase
                        .from('DeckCards')
                        .select(`
                        *,
                        Cards(name,
                                type,
                                desc,
                                card_images,
                                Monster:Monster_Cards(*),
                                Spell:Spell_Cards(race),
                                Trap:Trap_Cards(race))
                        `)
                        .eq('deck_id', id);

                    if (cardError) {
                        console.error(cardError);
                        return;
                    }
                    setCards(fetchedCards);
                    const updatedMonsterCards = [] as any;
                    const updatedSpellCards = [] as any;
                    const updatedTrapCards = [] as any;
                    Promise.all(fetchedCards.map(async (card) => {
                        console.log("card", card);
                        if (card.Cards.type.includes('Monster')) {
                            updatedMonsterCards.push(card);
                        } else if (card.Cards.type === 'Spell Card') {
                            updatedSpellCards.push(card);
                        } else if (card.Cards.type === 'Trap Card') {
                            updatedTrapCards.push(card);
                        }
                    }));
                    console.log("fetchedCards", fetchedCards);


                    // Update the state with the fetched cards and categorized cards
                    setCards(fetchedCards);
                    setMonsterCards(updatedMonsterCards);
                    setSpellCards(updatedSpellCards);
                    setTrapCards(updatedTrapCards);
                    setMonsterFilter(updatedMonsterCards);
                    setSpellFilter(updatedSpellCards);
                    setTrapFilter(updatedTrapCards);


                }
            } catch (error) { }
        }
        fetchDeck();

    }, [navigate, id]);





    return (
        <>
            <Navbar />
            <div ref={ref}>
                <div className=" px-[4%] lg:px-[10%] pt-6">
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

                    <div className="grid lg:grid-cols-12 gap-2 ">
                        <div className="col-span-5 flow-root" id="detail">
                            <label htmlFor="detail" className="block text-medium text-xl font-medium text-gray-900 pb-3"> Detail deck ID:{id}</label>
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
                                    <Link to="./edit" className="col-span-5">
                                        <button className="transition shadow-md cursor-pointer duration-500 hover:translate-y-0.5 delay-50 border-2 border-gray-300 hover:bg-gray-300 hover:text-white h-10 rounded col-span-4 px-2" type="submit">Edit or Add/Delete card</button>
                                    </Link>

                                </div>



                            </dl>

                        </div>

                        {expandedCardId && (<>
                            <div className="col-span-7 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all delay-50 duration-150" id="detail">

                                <div className="flex justify-end justify-conten-end ">
                                    <button onClick={() => setExpandedCardId(null)} className="text-gray-700 hover:text-gray-900 justify-conten-end absolute justify-end pt-2 pr-2 ">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-6 w-6"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-1 grid grid-cols-4">
                                    <div className="p-2 col-span-1 w-full"
                                        style={{ transition: 'transform 0.3s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                        <img src={expandedCardId.Cards.card_images} alt={expandedCardId.Cards.name} className=" object-cove" />
                                    </div>
                                    {/* <div className="p-2 col-span-3">
                                    <p className="text-xl font-semibold">{expandedCardId.Cards.name}</p>
                                    <p className="text-md text-gray-600">{expandedCardId.Cards.type}</p>
                                    {expandedCardId.Cards.Monster && expandedCardId.Cards.Monster[0] && (
                                        <>
                                            <p className="text-md text-gray-600"> Level: {expandedCardId.Cards.Monster[0].level}</p>
                                            <p className="text-md text-gray-600"> Attribute: {(expandedCardId.Cards.Monster[0].attribute as string)[0].toUpperCase() +(expandedCardId.Cards.Monster[0].attribute as string).slice(1).toLocaleLowerCase()}</p>
                                            <p className="text-md text-gray-600">{expandedCardId.Cards.Monster[0].attack} / {expandedCardId.Cards.Monster[0].defense}</p>
                                        </>

                                    )}

                                    <p className="text-sm text-gray-600">{expandedCardId.Cards.desc}</p>
                                </div> */}
                                    <dl className="col-span-3 ">
                                        <div className="grid grid-cols-1 gap-1 sm:grid-cols-8 sm:gap-6">
                                            <dd className="text-gray-700 sm:col-span-4 font-semibold py-2 text-xl">{expandedCardId.Cards.name}</dd>

                                        </div>

                                        <div className="grid grid-cols-1 gap-1 sm:grid-cols-8 sm:gap-6 h-auto">
                                            <dt className="font-medium text-gray-900 col-span-2">Type</dt>
                                            <dd className="text-gray-700 sm:col-span-4">{expandedCardId.Cards.type}</dd>

                                        </div>
                                        <div className="grid grid-cols-1 gap-1 sm:grid-cols-8 sm:gap-6 h-auto">
                                            <dt className="font-medium text-gray-900 col-span-2">Description</dt>
                                            <dd className="text-gray-700 sm:col-span-6 font-sm">
                                                {expandedCardId.Cards.desc}
                                            </dd>

                                        </div>
                                        {expandedCardId.Cards.Monster && expandedCardId.Cards.Monster[0] && (
                                            <>
                                                <div className="grid grid-cols-1 gap-1 sm:grid-cols-8 sm:gap-6 h-auto">
                                                    <dt className="font-medium text-gray-900 col-span-2">Level</dt>
                                                    <dd className="text-gray-700 sm:col-span-4">{expandedCardId.Cards.Monster[0].level}</dd>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1 sm:grid-cols-8 sm:gap-6 h-auto">
                                                    <dt className="font-medium text-gray-900 col-span-2">Attribute</dt>
                                                    <dd className="text-gray-700 sm:col-span-4">{expandedCardId.Cards.Monster[0].attribute}</dd>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1 sm:grid-cols-8 sm:gap-6 h-auto">
                                                    <dt className="font-medium text-gray-900 col-span-2">Attack/Defense</dt>
                                                    <dd className="text-gray-700 sm:col-span-4">{expandedCardId.Cards.Monster[0].attack} / {expandedCardId.Cards.Monster[0].defense}</dd>
                                                </div>
                                            </>
                                        )}
                                        {expandedCardId.Cards.Spell && expandedCardId.Cards.Spell[0] && (
                                            <>
                                                <div className="grid grid-cols-1 gap-1 sm:grid-cols-8 sm:gap-6 h-auto">
                                                    <dt className="font-medium text-gray-900 col-span-2">Race</dt>
                                                    <dd className="text-gray-700 sm:col-span-4">{expandedCardId.Cards.Spell[0].race}</dd>
                                                </div>
                                            </>
                                        )}
                                        {expandedCardId.Cards.Trap && expandedCardId.Cards.Trap[0] && (
                                            <>
                                                <div className="grid grid-cols-1 gap-1 sm:grid-cols-8 sm:gap-6 h-auto">
                                                    <dt className="font-medium text-gray-900 col-span-2">Race</dt>
                                                    <dd className="text-gray-700 sm:col-span-4">{expandedCardId.Cards.Trap[0].race}</dd>
                                                </div>
                                            </>
                                        )}
                                    </dl>
                                </div>
                            </div></>)}

                    </div>


                    <span className="relative flex justify-center lg:pt-12">
                        <div
                            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"
                        ></div>

                        <span className="relative z-10 bg-white px-6"></span>
                    </span>


                    {/* {Card section} */}

                    <div className="w-full">
                        <div className="my-1 sm:my-8 grid grid-cols-1 py-3 sm:grid-cols-5 sm:gap-2">
                            <div className="py-2 col-span-5">
                                <p className="font-semibold mb-4 text-3xl">{title}'s card</p>
                                <div className="">

                                    {/* button for select view mode */}
                                    <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                                        <button
                                            className={`inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative ${cardViews === "card" ? 'bg-gray-50' : 'bg-white'}`}
                                            title="Card View"
                                            onClick={() => changeTableView("card")}
                                            disabled={cardViews === "card"}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >
                                                <path d="M8.4 3H4.6C4.03995 3 3.75992 3 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3 3.75992 3 4.03995 3 4.6V8.4C3 8.96005 3 9.24008 3.10899 9.45399C3.20487 9.64215 3.35785 9.79513 3.54601 9.89101C3.75992 10 4.03995 10 4.6 10H8.4C8.96005 10 9.24008 10 9.45399 9.89101C9.64215 9.79513 9.79513 9.64215 9.89101 9.45399C10 9.24008 10 8.96005 10 8.4V4.6C10 4.03995 10 3.75992 9.89101 3.54601C9.79513 3.35785 9.64215 3.20487 9.45399 3.10899C9.24008 3 8.96005 3 8.4 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M19.4 3H15.6C15.0399 3 14.7599 3 14.546 3.10899C14.3578 3.20487 14.2049 3.35785 14.109 3.54601C14 3.75992 14 4.03995 14 4.6V8.4C14 8.96005 14 9.24008 14.109 9.45399C14.2049 9.64215 14.3578 9.79513 14.546 9.89101C14.7599 10 15.0399 10 15.6 10H19.4C19.9601 10 20.2401 10 20.454 9.89101C20.6422 9.79513 20.7951 9.64215 20.891 9.45399C21 9.24008 21 8.96005 21 8.4V4.6C21 4.03995 21 3.75992 20.891 3.54601C20.7951 3.35785 20.6422 3.20487 20.454 3.10899C20.2401 3 19.9601 3 19.4 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M19.4 14H15.6C15.0399 14 14.7599 14 14.546 14.109C14.3578 14.2049 14.2049 14.3578 14.109 14.546C14 14.7599 14 15.0399 14 15.6V19.4C14 19.9601 14 20.2401 14.109 20.454C14.2049 20.6422 14.3578 20.7951 14.546 20.891C14.7599 21 15.0399 21 15.6 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7951 20.7951 20.6422 20.891 20.454C21 20.2401 21 19.9601 21 19.4V15.6C21 15.0399 21 14.7599 20.891 14.546C20.7951 14.3578 20.6422 14.2049 20.454 14.109C20.2401 14 19.9601 14 19.4 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8.4 14H4.6C4.03995 14 3.75992 14 3.54601 14.109C3.35785 14.2049 3.20487 14.3578 3.10899 14.546C3 14.7599 3 15.0399 3 15.6V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H8.4C8.96005 21 9.24008 21 9.45399 20.891C9.64215 20.7951 9.79513 20.6422 9.89101 20.454C10 20.2401 10 19.9601 10 19.4V15.6C10 15.0399 10 14.7599 9.89101 14.546C9.79513 14.3578 9.64215 14.2049 9.45399 14.109C9.24008 14 8.96005 14 8.4 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        <button
                                            className={`inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative ${cardViews === "table" ? 'bg-gray-200' : 'bg-white'}`}
                                            title="Table view"
                                            onClick={() => changeTableView("table")}
                                            disabled={cardViews === "table"}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >
                                                <path d="M3 9L21 9M9 3L9 21M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </span>

                                    {/* {Table view} */}
                                    {cardViews === "table" && (
                                        <>

                                            <table className="mt-4 min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                                <thead className="ltr:text-left rtl:text-right">
                                                    <tr>
                                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Card Name</th>
                                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                                                    </tr>
                                                </thead>
                                                {/* {Map card here} */}
                                                {cards && Array.isArray(cards) && cards.map((card: any) => (
                                                    <tbody className="divide-y divide-gray-200" key={`${card.id}`}>
                                                        <tr className="odd:bg-gray-50">
                                                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{card.Cards.name}</td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{card.Cards.type}</td>
                                                        </tr>
                                                    </tbody>

                                                ))}
                                            </table>
                                            <div className="pt-5">
                                                <button className="transition shadow-md cursor-pointer duration-500 hover:translate-y-0.5 delay-50 border-2 border-gray-300 hover:bg-gray-300 hover:text-white h-10 rounded col-span-1 px-2 w-40" type="submit" onClick={download_img}>{<>
                                                    <div className="flex items-center gap-2">
                                                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                                            <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                        <div>
                                                            Export to image
                                                        </div>
                                                    </div>

                                                </>
                                                }</button>
                                            </div>
                                        </>
                                    )}
                                    {/* {Card view} */}
                                    {cardViews === "card" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 my-1 py-4">
                                                <p className="text-xl font-semibold">Monster</p>
                                                <div className="col-span-1">{filterCardZone()}</div>
                                                {/* Fillter */}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 my-1">
                                                {monsterFilter && Array.isArray(monsterFilter) && monsterFilter.map((card: any) => (
                                                    <div className="bg-amber-50 shadow-md rounded-md p-2" key={card.id}
                                                        onClick={() => (setExpandedCardId(card), document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                        )}
                                                        style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <div>
                                                            <img src={card.Cards.card_images} alt={card.Cards.name} className=" object-cover " />
                                                            <p className="text-sm font-semibold">{card.Cards.name}</p>
                                                            <p className="text-xs text-gray-600">{card.Cards.type}</p>
                                                            <p className="text-xs text-gray-600">{card.Cards.Monster[0].level} {card.Cards.Monster[0].attribute}</p>
                                                            {/* <p className="text-xs text-gray-600">{card.desc}</p> */}
                                                            <p className="text-xs text-gray-600">{card.Cards.Monster[0].attack} / {card.Cards.Monster[0].defense}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 my-1 py-4 mt-10">
                                                <p className="text-xl font-semibold">Spell</p>
                                                <div className="col-span-1">{renderSpellFilterZone()}</div>
                                                {/* Fillter */}
                                            </div>
                                            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 my-1">
                                                {spellFilter && Array.isArray(spellFilter) && spellFilter.map((card: any) => (
                                                    <div className="bg-emerald-50 shadow-md rounded-md p-2" key={card.id}
                                                        onClick={() => (setExpandedCardId(card), document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))}
                                                        style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <img src={card.Cards.card_images} alt={card.Cards.name} className=" object-cover" />
                                                        <p className="text-sm font-semibold">{card.Cards.name}</p>
                                                        <p className="text-xs text-gray-600">{card.Cards.type}</p>
                                                        <p className="text-xs text-gray-600">{card.Cards.Spell[0].race}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 my-1 py-4 mt-10">
                                                <p className="text-xl font-semibold">Trap</p>
                                                <div className="col-span-1">{renderTrapFilterZone()}</div>
                                                {/* Fillter */}
                                            </div>
                                            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 my-1">
                                                {trapFilter && Array.isArray(trapFilter) && trapFilter.map((card: any) => (
                                                    <div className="bg-yellow-50 shadow-md rounded-md p-2" key={card.id}
                                                        onClick={() => (setExpandedCardId(card), document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))}
                                                        style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <img src={card.Cards.card_images} alt={card.Cards.name} className=" object-cover" />
                                                        <p className="text-sm font-semibold">{card.Cards.name}</p>
                                                        <p className="text-xs text-gray-600">{card.Cards.type}</p>
                                                        <p className="text-xs text-gray-600">{card.Cards.Trap[0].race}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

        </>
    )



}
export default DeckDetail;