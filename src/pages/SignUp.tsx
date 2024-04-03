import { Link } from 'react-router-dom';
import supabase from '../server/App';
import { useState } from 'react';
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
            console.log(error);
            alert('Error signing up');
        } else {
            alert('Sign up successful');
        }
    }

    return (
        <>
            <div className='flex justify-center '>
                <form className='grid grid-row content-center justify-center w-4/12 mt-16 py-5 border-black border-2 rounded-md gap-2'>
                    <h1 className='text-center'>Sign Up</h1>
                    <label className='grid grid-cols-6'>
                        <div className='col-span-1'>Username:</div>
                        <div className='col-span-1'></div>
                        <input type="username" className="border-black border col-span-4" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label className='grid grid-cols-6'>
                        <div className='col-span-1'>Password:</div>
                        <div className='col-span-1'></div>
                        <input type="password" className="border-black border col-span-4" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <div className="flex justify-center">
                        <button type="button" className='border w-32 rounded-md bg-green-500 hover:bg-green-600' onClick={handleSignUp}>
                            Sign Up
                        </button>
                    </div>
                    Are you already have an account <Link to="/login" className='text-blue-500 underline'>Login</Link>
                </form>
            </div>
        </>

    );
}
export default SignUp;