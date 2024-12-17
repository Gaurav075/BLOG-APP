import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import Input from '../Input';
import Button from '../Button';
import Logo from '../Logo';
import Loader from '../Loader';
import authService from '../../appwrite/auth';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../store/authSlice';
import LoadingBar from 'react-top-loading-bar'

export default function ChengePassword() {
    const { register, handleSubmit } = useForm();
    const mode = useSelector((state) => state.mode);
    const authStatus = useSelector((state) => state.status);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isAllset, setIsAllset] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [isMatchPassword, setIsMatchPassword] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0)

    const [error, setError] = useState(null);

    const update = (data) => {
        if (!authStatus) {
            navigate('/error');
        } else {
            if (data.newPassword.length < 8) {
                setPasswordError("Password must be 8 characters")
            } else if (data.newPassword !== data.newPasswordAgain) {
                setIsMatchPassword("password dose not match 😵")
            }
            else {
                setIsDisabled(true)
                setProgress(10)
                authService.updatePassword({ newPassword: data.newPassword, oldPassword: data.oldPassword })
                    .then((responce) => {
                        if (typeof (responce) === "object") {
                            setProgress(50)
                            authService.logout()
                                .then((isconplete) => {
                                    if (isconplete) {
                                        setProgress(70)
                                        authService.login({ email: responce.email, password: data.newPassword })
                                            .then((data) => {
                                                if (typeof (data) === "object") {
                                                    dispatch(login(responce));
                                                    localStorage.setItem("sessionId", data.$id)
                                                    setIsDisabled(false);
                                                    setProgress(100)
                                                    setIsAllset(true);
                                                } else {
                                                    dispatch(logout());
                                                    setProgress(100)
                                                    navigate('/login')
                                                }
                                            })
                                    } else {
                                        dispatch(logout())
                                        setProgress(100)
                                        navigate('/error')
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
                        <p className={`text-center font-bold text-xl md:text-2xl my-2 ${mode === "dark" ? "text-white" : "text-black"}`}>Chenge your Password</p>
                        <p className='text-red-600 w-[90%] mx-auto'>{error}</p>
                        <form onSubmit={handleSubmit(update)}>
                            <Input mode={mode} lable="New Password :" type='password' placeholder='Enter new Password'
                                required={true}
                                error={passwordError}
                                {...register("newPassword", { required: true })}
                            />
                            <Input mode={mode} lable="Type again Your New Password :" type='password' placeholder='Enter new Password'
                                required={true}
                                error={isMatchPassword}
                                {...register("newPasswordAgain", { required: true })}
                            />
                            <Input mode={mode} lable="Old Password :" type='password' placeholder='Enter old Password'
                                required={true}
                                {...register("oldPassword", { required: true })}
                            />

                            <Button type="submit" chlidren="Chenge Email" className={`block rounded-lg w-[90%] mx-auto h-12 py-3 px-4 bg-blue-600 text-white font-semibold mt-7 mb-2 hover:bg-blue-500`} disabled={isDisabled} />
                        </form>
                        <p className='mx-auto w-[90%]'><Link to='/recovery' className={`hover:underline text-blue-700 ${mode === "dark" ? "" : ""}`}>Forgot Pasword?</Link></p></div>
                    :
                    <div><p className={`text-3xl font-semibold my-5 text-center ${mode === "dark" ? "text-white" : "text-black"}`}>All Sorted 😎</p>
                        <Link to={'/'}
                            className='block rounded-lg text-center h-10 py-2 px-4 bg-green-700 text-white font-semibold hover:bg-green-500 mx-auto'
                        >Back to Home
                        </Link>
                    </div>}
            </div>
        </div> : <Loader />
    )
}
