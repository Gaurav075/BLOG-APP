import React, { useEffect, useState } from 'react'
import {Link, useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import { useDispatch, useSelector } from 'react-redux';
import {login} from '../../store/authSlice';
import Logo from '../Logo';
import LoadingBar from 'react-top-loading-bar'

export default function EmailVerification() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const mode = useSelector((state) => state.mode);
    const user = useSelector((state) => state.userData);
    const [isDisabled,setIsDisabled]=useState(true)
    const [progress, setProgress] = useState(0)

    
    const submit=()=>{
        setError(null);
        const URLvalues=window.location.search;
        const urlParams=new URLSearchParams(URLvalues);
        setProgress(20)
        if (urlParams.has("secret")) {
            authService.confirmEmailVeryfication({userid:urlParams.get("userId"),token:urlParams.get("secret")})
            .then((responce)=>{
                setProgress(60)
                if (typeof(responce)==="boolean") {
                    dispatch(login({...user,emailVerification:true}));
                    setIsDisabled(false)
                    setProgress(90)
                }else{
                    setError(responce);
                }
                setProgress(100)
            })
        } else {
            navigate('/error')
            setProgress(100)
        }
    }
    useEffect(()=>{
        submit();
    },[])

    return (
        <div className='grid w-screen h-screen place-content-center bg-gradient-to-r from-purple-500 to-pink-500'>
        <LoadingBar
        color='#ff0000'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
            <div className={`w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] rounded-xl p-4 pb-8 ${mode === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <div className='ml-auto mr-auto w-16 h-16'>
                    <Logo className='w-16 h-16' />
                </div>

                {!error? 
                <p className={`text-center font-bold text-xl md:text-2xl my-2 ${mode === "dark" ? "text-white" : "text-black"}`}>{
                    isDisabled? "Just wait a moment..." : "Verification complite 🎉"
                }</p>
                :null}
                <p className='text-red-600 w-[90%] mx-auto'>{error}</p>
                {error? 
                <button type='button' 
                onClick={submit}
                className='block rounded-lg text-center h-10 py-2 px-4 bg-green-700 text-white font-semibold hover:bg-green-500 mx-auto'
                >
                Try again
                </button>: !isDisabled? 
                <Link
                className='block rounded-lg text-center h-10 py-2 px-4 bg-green-700 text-white font-semibold hover:bg-green-500 mx-auto'
                to={'/'}
                >Back to Home</Link> : null}

            </div>
        </div>
    )
}
