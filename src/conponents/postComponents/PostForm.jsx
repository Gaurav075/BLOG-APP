import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Input from '../Input'
import Loader from '../Loader'
import postService from '../../appwrite/post'
import RTE from './RTE'
import { useNavigate } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'


export default function PostForm({ post }) {

  const userData = useSelector((state) => state.userMetaData)
  const [error,setError]=useState(null);
  const navigate= useNavigate();
  const mode = useSelector((state) => state.mode)
  const [isDisabled,setIsDisable] = useState(true);
  const { register, handleSubmit, control } = useForm()
  const [progress, setProgress] = useState(0)


  const submit =async (data) => {
    setError(null)
    if (data.content===undefined||data.content.length < 10) {
      setError("❌ Content length must be grater then 100")
    }else{
      setProgress(20)
      setIsDisable(true)
      if (post) {
        const file= await postService.uploadImage(data.image[0])
        if (file) {
          setProgress(50)
          await postService.deleteImage(post.featuredImage);
        }
        data.featuredImage=file? file.$id : "652d183893f5548d9h6f";
        data.slug=post.$id;
        data.author=userData.photo;
        //console.log(data)
        setProgress(75);
        const dbpost= await postService.updatePost(data);
        if (dbpost) {
          navigate(`/post/${dbpost.$id}`)
          setProgress(100)
        }else{
          navigate('/error')
          setProgress(100)
        }
      } else {
        const file=await postService.uploadImage(data.image[0]);
        setProgress(50)
        data.featuredImage=file? file.$id : "652d183893f5548d9h6f";
        data.userId=userData.$id || userData.userName;
        data.author = userData.photo;
        const dbpost = await postService.createPost(data);
        setProgress(75)
        if (dbpost) {
          navigate(`/post/${dbpost.$id}`)
          setProgress(100)
        }else{
          navigate('/error')
          setProgress(100)
        }
      }
    }
  }
  useEffect(()=>{
    setIsDisable(false);
  },[])
  return (
    <div className={`w-screen h-auto px-[1vw] box-border md:px-[3vw] lg:px-[8vw] z-0 py-16 ${mode === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
      <LoadingBar
        color='#ff0000'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <form onSubmit={handleSubmit(submit)}>
        <Input
          type="text"
          lable="Title"
          mode={mode}
          defaultValue={post? post.title : ""}
          placeholder="Enter your post Title"
          required={true}
          {...register("title", { required: true })}

        />
        <RTE label="Content :" name="content" control={control} defaultValue={post ? post.content : ""} mode={mode} />
        <p className='text-red-600 w-[90%] mx-auto text-sm pt-1'>{error}</p>
        <img src={post ? postService.getView(post.featuredImage) : ""} alt="" className={post ? "w-screen sm:w-[90vw] md:w-[50vw] mx-auto my-6" : ""} />
        <div className={`${mode === "dark" ? "bg-gray-600" : "bg-gray-200"} w-56 mx-auto px-3 pt-1 my-3 rounded-xl pb-2 overflow-hidden`}>
          <label htmlFor="inputfile" className={`${mode === "dark" ? "text-white" : "text-black"} text-md mt-4 font-semibold block text-center mx-auto`}>
            {post ? "Cheenge image" : "Upload image"}
          </label>
          <input type="file"
            id='inputfile'
            className={`${mode === "dark" ? "text-white" : "text-black"} block mx-auto w-auto h-14 mt-3`}

            accept="image/png, image/jpg, image/jpeg, image/gif"
            required={post ? false : true}
            {...register("image", { required: !post })}
          />
          <p
          className={`${mode === "dark" ? "text-white" : "text-black"} text-md font-semibold block text-center mx-auto`}
          >{"Ratio: 16:9(Recomended)"}</p>
        </div>

        <div className={`rounded-xl w-56 p-3 mx-auto ${mode === "dark" ? "bg-gray-600" : "bg-gray-200"}`}>
          <label htmlFor="status" className={`w-full text-center font-semibold mb-2 block ${mode === "dark" ? "text-white" : "text-black"}`}>Status :</label>
          <select name="status" id="status"
            {...register("status", { required: true })}
            required={true}
            className={`px-3 py-2 rounded-lg ${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-400 text-black"} outline-none w-full`}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
        <input type="submit" value={post? "Save Chenges" : "Add post"} className={`block rounded-lg w-[90%] mx-auto h-12 py-3 px-4 bg-blue-600 text-white font-semibold mt-7 mb-2 hover:bg-blue-500`} readOnly={isDisabled} />

      </form>
      {isDisabled? <Loader/>:null}

    </div>
  )
}
