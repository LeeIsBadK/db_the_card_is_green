import { Link } from 'react-router-dom';
import supabase from '../server/App';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();


    const handleSignUp = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!password || !username) {
            alert('Please fill out all fields');
            return;
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username + "@dbcard.com",
            password: password,
        });
        if (error) {
            console.log(error);
            alert('Error signing up');
        } else {
            console.log(data);
            alert('Log in successful');
            navigate('/')
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log in</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div className="mt-2">
                                <input id="email" name="username" required className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={username} onChange={(e) => setUsername(e.target.value)} />
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
                            <button type="submit" className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600" onClick={handleSignUp} >Sign in</button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?
                        <Link to='/signup' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Sign up Here</Link>
                    </p>
                </div>
            </div>
        </>

    );
}
export default Login;