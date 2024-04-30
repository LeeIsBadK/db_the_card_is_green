import { Link } from 'react-router-dom';
import supabase from '../server/App';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({setToken}:any) => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();


    const handleSignUp = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if ( !password || !username) {
            alert('Please fill out all fields');
            return;
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username+"@dbcard.com",
            password: password,
        });
        if (error) {
            console.log(error);
            alert('Error signing up');
        } else {
            console.log(data);
            localStorage.setItem('token', JSON.stringify(data));
            setToken(data);
            alert('Log in successful');
            navigate('/')
        }
    }

    return (
        <>
            <div className='flex justify-center '>
                <form className='grid grid-row content-center justify-center w-4/12 mt-16 py-5 border-black border-2 rounded-md gap-2'>
                    <h1 className='text-center text-3xl bold font-bold'>Log in</h1>
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
                            Log in
                        </button>
                    </div>
                    <div className='mt-5'> Are you not have account</div> <Link to="/signup" className='text-blue-500 underline'>Sign up</Link>
                </form>
            </div>
        </>

    );
}
export default Login;