import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import Input from '../Input';
import Button from '../Button';
import authService from '../../appwrite/auth';
import { useDispatch, useSelector } from 'react-redux';
import { login as authLogin,setMetaData } from '../../store/authSlice';
import Logo from '../Logo';
import Loader from '../Loader';
import LoadingBar from 'react-top-loading-bar'

export default function Login() {
    const { register, handleSubmit } = useForm();
    const mode = useSelector((state) => state.mode);
    const authStatus = useSelector((state) => state.status);
    const [isDisabled,setIsDisabled]=useState(false)
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0)

    const [error, setError] = useState(null);
    const isEmail = (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
    

    const login = async (data) => {
        setEmailError(null);
        setPasswordError(null);
        setError(null);
        if (!isEmail(data.email)) {
            setEmailError("email must be a valid email!")
            //setIsDisabled(false);
        } else if (data.password.length < 8) {
            setPasswordError("password length is must be 8")
            //setIsDisabled(false);
        } else {
            setIsDisabled(true);
            setProgress(20)
            const session = await authService.login(data);
            if (typeof(session)==="object") {
                setProgress(40)
                localStorage.setItem("sessionId",session.$id)
                const userData = await authService.getCurrentUser();
                if (userData) {
                    setProgress(70)
                    let metaData=await authService.getUserData(userData.$id)
                    if (metaData) {
                        dispatch(setMetaData(metaData))
                        dispatch(authLogin(userData));
                        setProgress(100)
                        navigate('/');   
                    } else {
                        metaData=await authService.getUserData(userData.$id);
                        dispatch(setMetaData(metaData))
                        dispatch(authLogin(userData));
                        setProgress(100)
                        navigate('/'); 
                    }
                }else{
                    await authService.deleteSession(session.$id);
                    localStorage.removeItem("sessionId")
                    setError("something went wrong, try again");
                    setProgress(100);
                    setIsDisabled(false);
                }
            } else {
                setError(session);
                setProgress(100);
                setIsDisabled(false);
            }
        }
    }

    useEffect(() => {
        if (authStatus) {
            navigate("/");
        }
    }, [authStatus])

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
                <p className={`text-center font-bold text-xl md:text-2xl my-2 ${mode === "dark" ? "text-white" : "text-black"}`}>Sign in to your account</p>
                <p className={`text-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"} mb-7`}
                >Dont't have any account? <Link to={'/signup'} className='hover:underline hover:text-blue-700'>Sign up</Link></p>
                <p className='text-red-600 w-[90%] mx-auto'>{error}</p>
                <form onSubmit={handleSubmit(login)}>
                    <Input mode={mode} lable="Email :" type='email' placeholder='Enter your email'
                        required={true}
                        error={emailError}
                        {...register("email", { required: true })}
                    />
                    <Input mode={mode} lable="Password :" type='password' placeholder='Enter Password'
                        required={true}
                        error={passwordError}
                        {...register("password", { required: true,})}
                    />
                    <Button type="submit" chlidren="Log in" className={`block rounded-lg w-[90%] mx-auto h-12 py-3 px-4 bg-blue-600 text-white font-semibold mt-7 mb-2 hover:bg-blue-500`} disabled={isDisabled} />
                </form>
              
            </div>
            {isDisabled? <Loader /> : ""}
        </div>
    )
}
