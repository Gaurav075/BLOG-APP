import React, { useEffect } from 'react'
import {PostForm} from '../conponents/export'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
export default function CreatePost() {
    const authStatus = useSelector((state)=>state.status);
    const userData = useSelector((state)=>state.userData);
    const navigate =useNavigate()
    useEffect(()=>{
        if (authStatus===false || userData === null ) {
            navigate('/')
        }
    },[])
  return (
    <>
    <PostForm />
    </>
  )
}
