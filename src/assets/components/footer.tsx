function footer_us() {
    return (
        <footer className="bg-gray-50 mt-16">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex justify-center text-teal-600 sm:justify-start">
                        <p className="font-mono italic ">The grass is green TEAM</p>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
                        Published for CU 2301375 2/2023 project.
                    </p>
                    <ul className="flex justify-center gap-6 text-sm">
                        <li className="text-gray-500">LeeIsbadK</li>
                        <li className="text-gray-500">GodOfThrow</li>
                        <li className="text-gray-500">reinnFK</li>
                        <li className="text-gray-500">aomCU</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default footer_us;