import React, { useEffect, useState } from 'react'
import {PostForm} from '../conponents/export'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import postService from '../appwrite/post';

export default function EditPost() {
    const [post,setPost]=useState(null);
    const navigate =useNavigate();
    const {postid} = useParams();
    const authStatus =useSelector((state)=>state.status)
    const userData =useSelector((state)=>state.userData)
    useEffect(()=>{
        if (authStatus===false || userData===null) {
            navigate('/')
        } else if(postid) {
            postService.getPost({slug:postid})
            .then((postData)=>{
                if (postData) {
                    setPost(postData);
                } else {
                    navigate('/error');
                }
            })
        }else{
            navigate('/');
        }
    },[postid,navigate])
  return (
    <>
    <PostForm post={post}/>
    </>
  )
}
