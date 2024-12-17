import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'
import Input from './Input'
import { Link } from 'react-router-dom'
import { setMetaData } from '../store/authSlice'
import LoadingBar from 'react-top-loading-bar'

export default function UserDetailsUpdateForm({ userData, mode }) {
  const { register, handleSubmit } = useForm()
  const [disbled, setDisbled] = useState(false);
  const [notification, setNotification] = useState(null);
  const disptch = useDispatch()
  const [progress, setProgress] = useState(0)


  const notificationController = (data) => {
    setNotification(data);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }

  const submit = (data) => {
    setDisbled(true)
    if (data.fullName == "" && data.about == "" && data.phone == "" && data.address == "" && data.hobby == "" && data.public == userData.public) {
      setDisbled(false);
    } else {
      setProgress(40)
      data.public === "true" ? data.public = true : data.public = false;
      authService.updateUserData({ ...data }, userData.$id)
        .then((responce) => {
          if (typeof (responce) === "object") {
            disptch(setMetaData(responce));
            setDisbled(false);
            setProgress(100)
            notificationController("✔️ Changes are Saved!");
          } else {
            setDisbled(false);
            setProgress(100)
            notificationController(`❌ ${responce}`)
          }
        })
    }
  }
  return (
    <div className='w-screen pb-8'>
      <LoadingBar
        color='#ff0000'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {notification ? <p className='fixed top-16 right-0 h-12 p-2 text-black font-semibold rounded-l-full bg-gray-300 border-green-600 border-2'
      >{notification}</p> : null}
      <form onSubmit={handleSubmit(submit)}>
        <Input
          type='text'
          lable={"Full Name :"}
          mode={mode}
          placeholder="Add your Full Name"
          defaultValue={userData.fullName ? userData.fullName : null}
          {...register("fullName", { required: false })}
        />

        <Input
          type='text'
          lable={"About :"}
          mode={mode}
          placeholder="Write something about you"
          defaultValue={userData.about ? userData.about : null}
          {...register("about", { required: false })}
        />

        <Input
          type='text'
          lable={"Contect number :"}
          mode={mode}
          placeholder="Add your phone number"
          defaultValue={userData.phone ? userData.phone : null}
          {...register("phone", { required: false })}
        />

        <Input
          type='text'
          lable={"Address :"}
          mode={mode}
          placeholder="Add your Address"
          defaultValue={userData.address ? userData.address : null}
          {...register("address", { required: false })}
        />

        <Input
          type='text'
          lable={"Hobbys :"}
          mode={mode}
          placeholder="Add your hobbys"
          defaultValue={userData.hobby ? userData.hobby : null}
          {...register("hobby", { required: false })}
        />

        <div className={`rounded-xl mt-5 w-56 p-3 mx-auto ${mode === "dark" ? "bg-gray-600" : "bg-gray-200"}`}>
          <label htmlFor="status" className={`w-full text-center font-semibold mb-2 block ${mode === "dark" ? "text-white" : "text-black"}`}>Account type :</label>
          <select name="status" id="status"
            {...register("public", { required: false })}
            className={`px-3 py-2 rounded-lg ${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-400 text-black"} outline-none w-full`}
          >
            <option value={true}>Public</option>
            <option value={false}>Private</option>
          </select>
        </div>

        <input type="submit" value="save changes" readOnly={disbled}
          className='block rounded-lg w-42 text-center h-12 py-3 px-4 bg-blue-600 text-white font-semibold mt-7
        hover:bg-blue-500 float-right mr-[8vw]'
        />

        <Link to={'/'}
          className='block rounded-lg w-42 text-center h-12 py-3 px-4 bg-green-700 text-white font-semibold mt-7
        hover:bg-green-500 float-left ml-[6vw]'
        >
          Back to Home
        </Link>

      </form>
    </div>
  )
}
