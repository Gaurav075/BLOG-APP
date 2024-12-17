import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import Logo from '../Logo'
import ProfileLogo from '../ProfileLogo';
import { setMode } from '../../store/authSlice';
import authService from '../../appwrite/auth';
import postService from '../../appwrite/post';


export default function Header() {
    const auth = useSelector((state) => state.status);
    const user = useSelector((state) => state.userData);
    const dispatch= useDispatch()
    const userMetadata = useSelector((state) => state.userMetaData);
    const getMode = useSelector((state) => state.mode);
    const [mode, setmode] = useState(getMode);
    const chengeMode =async () => {
        if (auth) {
            if (getMode === "dark") {
                setmode("light")
                dispatch(setMode("light"))
                await authService.updatePreferences({ mode: "light" })
            } else {
                setmode('dark')
                dispatch(setMode("dark"))
                await authService.updatePreferences({ mode: "dark" })
            }
            
        }else{
            if (getMode==="dark") {
                dispatch(setMode("light"))
            }else{
                dispatch(setMode("dark"))
            }
        }
    }
    return (
        <div >
            <header className={`w-screen h-14 flex z-10 justify-between bg-blue-600 py-2 px-3 sm:px-5 md:px-8 fixed top-0 left-0`}>
                <div className='m-0 p-0'>
                    <Logo className='w-10 h-10' />
                </div>
                <ul className={`w-[70%] flex flex-nowrap justify-center mt-2`}>
                    <li><NavLink to="/" className={({isActive}) =>
                                        `text-md hover:text-black font-bold mx-3 ${isActive ? "text-black" : "text-white"}`}
                    >
                        Home
                    </NavLink></li>
                    <li hidden={auth ? false : true}><NavLink to="/create-post" className={({isActive}) =>
                                        `text-md hover:text-black font-bold mx-3 ${isActive ? "text-black" : "text-white"}`}>
                        Create post
                    </NavLink></li>
                    <li hidden={auth ? true : false}><NavLink to="/login" className={({isActive}) =>
                                        `text-md hover:text-black font-bold mx-3 ${isActive ? "text-black" : "text-white"}`}>
                        Login
                    </NavLink></li>
                    <li hidden={auth ? true : false}><NavLink to="/signup" className={({isActive}) =>
                                        `text-md hover:text-black font-bold mx-3 ${isActive ? "text-black" : "text-white"}`}>
                        Sign Up
                    </NavLink></li>
                    <li title={`${mode==="dark"? "light":"dark"} mode`}><button className={"material-symbols-outlined text-white mx-3"} onClick={chengeMode}>
                        {mode==="dark"? "light":"dark"}_mode
                    </button></li>
                </ul>
                {auth&&userMetadata ? <div className='m-0 p-0' title='My Profile'>
                    <ProfileLogo URL={`/user/${user.$id}`} imgURL={postService.getPreview({fileId:userMetadata.photo,quality:5})} />
                </div> : null}

            </header>

        </div>
    )
}
