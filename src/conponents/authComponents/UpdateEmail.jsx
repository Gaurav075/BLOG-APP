import React, { useEffect, useState, useId } from 'react'
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import Input from '../Input';
import Button from '../Button';
import Logo from '../Logo';
import Loader from '../Loader';
import authService from '../../appwrite/auth';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, setMetaData } from '../../store/authSlice';
import LoadingBar from 'react-top-loading-bar'

export default function UpdateEmail() {
    const { register, handleSubmit } = useForm();
    const mode = useSelector((state) => state.mode);
    const authStatus = useSelector((state) => state.status);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isAllset, setIsAllset] = useState(false);
    const [emailError, setEmailError] = useState(null);
    const ID = useId()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0)

    const isEmail = (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)

    const update = (data) => {
        if (!authStatus) {
            navigate('/error');
        } else {
            if (!isEmail(data.email)) {
                setEmailError("Invalid Email Address 😑")
            } else {
                setIsDisabled(true)
                setProgress(10)
                authService.updateEmail({ email: data.email, password: data.password })
                    .then((responce) => {
                        if (typeof (responce) === "object") {
                            setProgress(50)
                            dispatch(login(responce));
                            authService.updateUserData({ email: responce.email }, responce.$id)
                                .then((data) => {
                                    if (typeof (data) === "object") {
                                        setProgress(80)
                                        dispatch(setMetaData(data))
                                    } else {
                                        dispatch(logout())
                                        setProgress(100)
                                        navigate('/login')
                                    }
                                })
                                .finally(() => {
                                    if (data.isLogout) {
                                        authService.logout()
                                            .then((isLogout) => {
                                                if (isLogout) {
                                                    dispatch(logout());
                                                    setProgress(100)
                                                    navigate('/login');
                                                } else {
                                                    setProgress(100)
                                                    navigate('/error')
                                                }
                                            })
                                    } else {
                                        setIsDisabled(false)
                                        setProgress(100)
                                        setIsAllset(true)
                                    }
                                })
                        } else {
                            setError(responce)
                            setProgress(100)
                            setIsDisabled(false)
                        }
                    })
            }
        }
    }

    return (!isDisabled ?
        <div className='grid w-screen h-screen place-content-center bg-gradient-to-r from-purple-500 to-pink-500'>
            <LoadingBar
                color='#ff0000'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className={`w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] rounded-xl p-4 pb-5 ${mode === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <div className='ml-auto mr-auto w-16 h-16'>
                    <Logo className='w-16 h-16' />
                </div>
                {!isAllset ?
                    <div>
                        <p className={`text-center font-bold text-xl md:text-2xl my-2 ${mode === "dark" ? "text-white" : "text-black"}`}>Chenge your Email</p>
                        <p className='text-red-600 w-[90%] mx-auto'>{error}</p>
                        <form onSubmit={handleSubmit(update)}>
                            <Input mode={mode} lable="New Email :" type='email' placeholder='Enter new email'
                                required={true}
                                error={emailError}
                                {...register("email", { required: true })}
                            />
                            <Input mode={mode} lable="Password :" type='password' placeholder='Enter Password'
                                required={true}
                                {...register("password", { required: true })}
                            />
                            <div className='w-[90%] mx-auto mt-4'>
                                <input type="checkbox" name="" id={ID}
                                    {...register("isLogout", { required: false })}
                                />
                                <label htmlFor={ID}
                                    className={`ml-3 font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}
                                > Logout from all devices?</label>
                            </div>
                            <Button type="submit" chlidren="Chenge Email" className={`block rounded-lg w-[90%] mx-auto h-12 py-3 px-4 bg-blue-600 text-white font-semibold mt-7 mb-2 hover:bg-blue-500`} disabled={isDisabled} />
                        </form>
                        <p className='mx-auto w-[90%]'><Link to='/recovery' className={`hover:underline text-blue-700 ${mode === "dark" ? "" : ""}`}>Forgot Pasword?</Link></p></div>
                    :
                    <div><p className={`text-3xl font-semibold my-5 text-center ${mode === "dark" ? "text-white" : "text-black"}`}>All Sorted 😎</p>
                        <div className='flex justify-between flex-nowrap pt-10'>
                            <Link to={'/verify-email'}
                                className='block rounded-lg text-center h-10 py-2 px-4 bg-green-700 text-white font-semibold hover:bg-green-500'
                            >Verify Email
                            </Link>

                            <Link to={'/'}
                                className='block rounded-lg text-center h-10 py-2 px-4 bg-green-700 text-white font-semibold hover:bg-green-500'
                            >Back to Home
                            </Link>
                        </div>
                    </div>}
            </div>
        </div> : <Loader />
    )
}
