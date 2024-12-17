import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from '../conponents/Input';
import Logo from '../conponents/Logo';
import authService from '../appwrite/auth';
import LoadingBar from 'react-top-loading-bar'

export default function RecoveryTrue() {
  const mode = useSelector((state) => state.mode);
  const { register, handleSubmit } = useForm();
  const [password1Error, setPassword1Error] = useState(null)
  const [password2Error, setPassword2Error] = useState(null)
  const [error, setError] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false);
  const [isComplite, setIsComplite] = useState(false);
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const URLvalues = window.location.search;
  const urlParams = new URLSearchParams(URLvalues);

  const submit = (data) => {
    if (data.password1.length < 8) {
      setPassword1Error("password length must be atlist 8 characters");
    } else if (data.password1 !== data.password2) {
      setPassword2Error("passwors must be same!")
    } else {
      setProgress(50)
      setIsDisabled(true)
      authService.recoveryConfirm({ userid: urlParams.get("userId"), token: urlParams.get("secret"), password1: data.password1, password2: data.password2 })
        .then((responce) => {
          if (responce === true) {
            setProgress(100)
            setIsComplite(true);
          } else {
            setError(responce);
            setProgress(100)
            setIsDisabled(false)
          }
        })
    }
  }

  useEffect(() => {
    if (!urlParams.has("secret")) {
      navigate('/error')
    }
  })

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
        {!isComplite ?
          <div>
            <p className={`text-center font-bold text-xl md:text-2xl my-2 ${mode === "dark" ? "text-white" : "text-black"}`}>Account Recovery</p>
            <p className='text-red-600 w-[90%] mx-auto'>{error}</p>
            <form onSubmit={handleSubmit(submit)}>
              <Input mode={mode} lable="New Password :" type='password' placeholder='Enter Password'
                required={true}
                error={password1Error}
                {...register("password1", { required: true, })}
              />
              <Input mode={mode} lable="Type Again :" type='password' placeholder='Enter Password again'
                required={true}
                error={password2Error}
                {...register("password2", { required: true, })}
              />
              <input type="submit" value="Submit" className={`block rounded-lg w-[90%] mx-auto h-12 py-3 px-4 bg-blue-600 text-white font-semibold mt-7 mb-2 hover:bg-blue-500`} readOnly={isDisabled} />
            </form>
          </div> :
          <div>
            <p className={`text-center font-bold text-xl md:text-2xl my-8 ${mode === "dark" ? "text-white" : "text-black"}`}>
              Password Chenged succesfully 🎉
            </p>
            <Link
              className='block rounded-lg text-center w-48 h-12 py-2 px-4 bg-green-700 text-white font-semibold hover:bg-green-500 mx-auto'
              to={'/login'}
            >
              Back to Login
            </Link>
          </div>}
      </div>
    </div>
  )
}
