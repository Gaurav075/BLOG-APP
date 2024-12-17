import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Loader from '../conponents/Loader'
import Logo from '../conponents/Logo'
import LoadingBar from 'react-top-loading-bar'

export default function Verification() {
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.status)
    const mode = useSelector((state) => state.mode)
    const userData = useSelector((state) => state.userData)
    const [loading, setLoading] = useState(true)
    const [isVeryfied, setIsveryfied] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (!authStatus || userData === null) {
            navigate('/login')
        } else {
            if (userData.emailVerification) {
                setIsveryfied(true);
            } else {
                setProgress(50)
                authService.createEmailVeryfication()
                    .then((responce) => {
                        if (responce) {
                            setProgress(100)
                            setLoading(false)
                        } else {
                            setProgress(100)
                            navigate('/error')
                        }
                    })
            }
        }
    }, [])
    return (
        <>
            <LoadingBar
                color='#ff0000'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            {
                !loading ?
                    <div className='grid w-screen h-screen place-content-center bg-gradient-to-r from-purple-500 to-pink-500'>
                        <div className={`w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] rounded-xl p-4 pb-8 ${mode === "dark" ? "bg-gray-900" : "bg-white"}`}>
                            <div className='ml-auto mr-auto w-16 h-16'>
                                <Logo className='w-16 h-16' />
                            </div>
                            {
                                isVeryfied ?
                                    <p className={`text-center font-bold text-xl md:text-xl my-2 ${mode === "dark" ? "text-white" : "text-black"}`}>Your Account Is Already Veryfied 😮 <br />
                                        <Link to={'/'} className='block text-center font-semibold text-blue-700'
                                        >Back to Home</Link>
                                    </p> :
                                    <p className={`text-center font-bold text-xl md:text-xl my-2 ${mode === "dark" ? "text-white" : "text-black"}`}>Verification email is send to email <br />Please check Your inbox</p>
                            }
                        </div>
                    </div> : <Loader />
            }
        </>
    )
}
