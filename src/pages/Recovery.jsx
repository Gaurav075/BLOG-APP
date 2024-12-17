import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import Input from '../conponents/Input'
import authService from '../appwrite/auth';
import { useSelector } from 'react-redux';
import Logo from '../conponents/Logo';
import LoadingBar from 'react-top-loading-bar'

export default function Recovery() {
  const { register, handleSubmit } = useForm();
  const mode = useSelector((state) => state.mode);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isComplite, setIsComplite] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [progress, setProgress] = useState(0)

  const [error, setError] = useState(null);
  const isEmail = (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)

  const recover = (data) => {
    if (!isEmail(data.email)) {
      setEmailError("email must be a valid email address")
    } else {
      setProgress(50)
      setIsDisabled(true)
      authService.createRecovery({ email: data.email })
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

  return (
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
        {!isComplite ?
          <div>
            <p className={`text-center font-bold text-xl md:text-2xl my-2 ${mode === "dark" ? "text-white" : "text-black"}`}>Recover Password</p>
            <p className='text-red-600 w-[90%] mx-auto'>{error}</p>
            <form onSubmit={handleSubmit(recover)}>
              <Input mode={mode} lable="Email :" type='email' placeholder='Enter your email address'
                required={true}
                error={emailError}
                {...register("email", { required: true })}
              />
              <input type="submit" value="Submit" className={`block rounded-lg w-[90%] mx-auto h-12 py-3 px-4 bg-blue-600 text-white font-semibold mt-7 mb-2 hover:bg-blue-500`} readOnly={isDisabled} />
            </form>
          </div> : <p className={`text-center font-bold text-lg md:text-xl my-8 ${mode === "dark" ? "text-white" : "text-black"}`}>Recovery email is send to your email <br />Please check Your inbox</p>}
      </div>
    </div>
  )
}