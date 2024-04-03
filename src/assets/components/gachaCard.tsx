import { Link } from "react-router-dom";

const gachaCard = (gasha:any) => {
    return (
        <div className="my-3 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" key={gasha.id}>
        <h3 className="text-white">{gasha.title}</h3>
        <p className="text-white">{gasha.description}</p>
        <p className="text-white">Amount: {gasha.amount}</p>
        <div className="buttons">
            <Link to={`/${gasha.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Edit</Link>
        </div>
        </div>
    );
}
export default gachaCard;