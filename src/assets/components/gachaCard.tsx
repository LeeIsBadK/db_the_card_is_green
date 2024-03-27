const gachaCard = (gasha:any) => {
    return (
        <div className="my-3 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" key={gasha.id}>
        <h3 className="text-white">{gasha.title}</h3>
        <p className="text-white">{gasha.description}</p>
        <p className="text-white">Amount: {gasha.amount}</p>
        </div>
    );
}
export default gachaCard;