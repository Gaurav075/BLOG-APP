import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import postService from '../../appwrite/post'
import { useForm } from 'react-hook-form'
import { setMetaData } from '../../store/authSlice'
import Input from '../Input'
import UserDetailsUpdateForm from '../UserDetailsUpdateForm'
import { Link } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'

export default function ProfileEdit() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userMetaData);
  const user = useSelector((state) => state.userData);
  const mode = useSelector((state) => state.mode);
  const { register, handleSubmit } = useForm()
  const [disbled, setDisbled] = useState(false);
  const [imgURL, setImgURL] = useState(postService.getPreview({ fileId: userData.photo, quality: 70 }))
  const [progress, setProgress] = useState(0)


  const chengeImg = (data) => {
    setDisbled(true)
    setProgress(10)
    postService.uploadImage(data.image[0])
      .then((file) => {
        if (file) {
          setProgress(40)
          if (userData.photo !== "652d183kdgfl755548d9h6f") {
            postService.deleteImage(userData.photo)
              .then(() => {
                setProgress(60)
                authService.updateUserData({ photo: file.$id }, userData.$id)
                  .then((data) => {
                    if (data) {
                      setProgress(80)
                      dispatch(setMetaData({ ...userData, photo: file.$id }))
                      setImgURL(postService.getPreview({ fileId: file.$id, quality: 70 }))
                      setProgress(100);
                    }
                  })
              })
          } else {
            setProgress(40)
            authService.updateUserData({ photo: file.$id }, userData.$id)
              .then((data) => {
                if (data) {
                  setProgress(70)
                  dispatch(setMetaData({ ...userData, photo: file.$id }))
                  setImgURL(postService.getPreview({ fileId: file.$id, quality: 70 }))
                  setProgress(90)
                }
              })
          }
        }
      })
      .finally(() => {
        setProgress(100)
        setDisbled(false)
      })
  }



  return (
    <div className={`w-screen z-0 py-20 min-h-screen ${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <LoadingBar
        color='#ff0000'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className='w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw] md:w-[30vw] md:h-[30vw] lg:w-[20vw] lg:h-[20vw] mx-auto'>
        <img src={imgURL} alt="logo" className='w-full h-full rounded-full p-2 border-4 border-green-600' />
        <div className="grig place-content-center relative bottom-[65%] left-[40%] w-full h-full z-20"
          hidden={!disbled}>
          <span className='loader2'></span>
        </div>
      </div>
      <form onSubmit={handleSubmit(chengeImg)} className='flex flex-wrap justify-center mt-3'>

        <div className={`${mode === "dark" ? "bg-gray-600" : "bg-gray-200"} w-56 mx-4 px-3 pt-1 my-3 rounded-xl overflow-hidden`}>

          <label htmlFor="inputfile" className={`${mode === "dark" ? "text-white" : "text-black"} text-md mt-2 font-semibold block text-center mx-auto`}>
            choose Photo
          </label>

          <input type="file"
            id='inputfile'
            className={`${mode === "dark" ? "text-white" : "text-black"} block mx-auto w-auto h-14 mt-3`}
            accept="image/png, image/jpg, image/jpeg, image/gif"
            required={true}
            {...register("image", { required: true })}
          />
        </div>

        <input className='block mx-4 rounded-lg w-42 text-center h-12 py-3 px-4 bg-blue-600 text-white font-semibold mt-7 mb-2
             hover:bg-blue-500'
          type='submit' value='Chenge Photo'
          readOnly={disbled}
        />
      </form>
      {user.emailVerification == true ? <p className='hover:underline w-[90%] mx-auto block pl-6 font-semibold'>✅ Verified Account</p> :
        <Link className='text-blue-600 font-semibold underline w-[90%] mx-auto block pl-6'
          to={'/verify-email'}
        >Verify your Account</Link>}

      <p className='w-[90%] mx-auto px-3 mt-5 mb-1 font-semibold'>UserName :</p>
      <Input mode={mode} readOnly={true} type='text' value={`${userData.$id}`} className='w-full' />

      <p className='w-[90%] mx-auto px-3 mt-5 mb-1 font-semibold'>Email :</p>
      <div className='flex flex-nowrap justify-between w-[90%] mx-auto '>
        <input type="text"
          className={`block w-[80%] rounded-lg h-10 py-3 px-4 ${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
          value={userData.email}
          readOnly={true}
        />
        <Link to={'/edit-email'}
          className='block rounded-lg text-center h-10 py-2 px-4 bg-green-700 text-white font-semibold
        hover:bg-green-500 float-left'
        >Edit</Link>
      </div>

      <p className='w-[90%] mx-auto px-3 mt-5 mb-1 font-semibold'>Password :</p>
      <div className='flex flex-nowrap justify-between w-[90%] mx-auto '>
        <input type="password"
          className={`block w-[80%] rounded-lg h-10 py-3 px-4 ${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
          value={"12345678"}
          readOnly={true}
        />
        <Link to={'/edit-password'}
          className='block rounded-lg text-center h-10 py-2 px-4 bg-green-700 text-white font-semibold
        hover:bg-green-500 float-left'
        >Edit</Link>
      </div>

      <h2 className='w-[90%] mx-auto text-2xl font-bold my-8 text-green-600'
      >Edit Personal Details</h2>

      <UserDetailsUpdateForm userData={userData} mode={mode} />

    </div>
  )
}
