import { Link } from 'react-router-dom';
import supabase from '../server/App';
import { useState } from 'react';
import Footer from '../assets/components/footer';
const SignUp = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSignUp = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if ( !password || !username) {
            alert('Please fill out all fields');
            return;
        }
        const { error } = await supabase.auth.signUp({
            email: username+"@dbcard.com",
            password: password,
            options: {
                data: { username: username }
            },
        });
        if (error) {
            console.error(error);
            alert('Error signing up');
        } else {
            alert('Sign up successful');
        }
    }

    return (
        <>
            <div className="flex h-[85vh] flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div className="mt-2">
                                <input id="username" name="username" required className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <div className="text-sm">
                                </div>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600" onClick={handleSignUp} >Sign up</button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Are you already have an account?
                        <Link to='/login' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Log in Here</Link>
                    </p>
                </div>
            </div>
            <Footer/>
        </>

    );
}
export default SignUp;