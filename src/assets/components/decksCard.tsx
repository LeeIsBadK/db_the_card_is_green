import { Link } from "react-router-dom";

const gachaCard = (decks: any) => {
    const ygo_back = "/YGO-backcard.png"
    return (
        <Link to={`/${decks.id}`} key={decks.id}>
            <div
            className="group cursor-pointer transition-all duration-500 bg-stone-400 hover:translate-y-2 hover:bg-stone-600 hover:text-white h-40 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-4 px-4"
        >
            <img src={ygo_back} alt="deck" className="w-20" />
  
            <div className="w-36">
                <span className=" transition-all duration-500 font-bold text-teal-700 text-xl group-hover:text-sky-400">{decks.name}</span>
                <p className="line-clamp-3">
                    Description: {decks.description}
                </p>
            </div>
        </div>
        </Link>

    );
}
export default gachaCard;