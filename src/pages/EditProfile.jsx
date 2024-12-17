import React, { useEffect, useState } from 'react'
import {ProfileEdit} from '../conponents/export'
import {useSelector} from 'react-redux'
import { useNavigate,useParams } from 'react-router-dom'
import Loader from '../conponents/Loader'
export default function EditProfile() {
  const {userid} =useParams()
  const navigate =useNavigate();
  const authStatus = useSelector((state) => state.status)
  const user = useSelector((state) => state.userData)
  const [loading,setLoading] =useState(true);
  useEffect(()=>{
    if (!authStatus || user===null || userid !== user.$id) {
        navigate(`/user/${userid}`)
    }
    setLoading(false);
  },[])
  return (
    <>
    {
      !loading ? <ProfileEdit/> : <Loader home={true} />
    }
    </>
  )
}
