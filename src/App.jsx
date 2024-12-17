//for next time userData culloction id ar , user id and profile image id remain same;

import React,{useEffect,useState} from 'react'
import Header from './conponents/header/Header';
import Footer from './conponents/footer/Footer';
import { useDispatch, useSelector } from 'react-redux'
import authService from './appwrite/auth';
import {login,logout,setMetaData,setMode} from './store/authSlice'
import { Outlet } from 'react-router-dom';
import Loader from './conponents/Loader'
import LoadingBar from 'react-top-loading-bar'

function App() {
  const [loding, setLoding] = useState(true);
  const user =useSelector((state)=>state.userData)
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0)
 
  useEffect(()=>{
    setProgress(10)
    authService.getCurrentUser()
    .then((userData)=>{
    if (userData) {
        dispatch(login(userData));
        dispatch(setMode(userData.prefs.mode));
        setProgress(50)
      } else {
        dispatch(logout());
        setProgress(100)
      }
    })
  },[])

  useEffect(()=>{
    if (user) {
      setProgress(70)
      authService.getUserData(user.$id)
      .then((data)=>{
        setProgress(85);
        if (data) {
          dispatch(setMetaData(data))
        } else {
          dispatch(logout())
        }
      })
      .finally(()=>{
        setLoding(false)
        setProgress(100)
      })
    }else{
      setLoding(false);
    }
  },[user])
  return !loding ? (
    <>
        <LoadingBar
        color='#ff0000'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
    <Header/>
    <main>
    <Outlet/>
    </main>
    <Footer/>
    </>
  ) : <Loader home={true}/>
}

export default App
