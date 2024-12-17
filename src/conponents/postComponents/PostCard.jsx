import React, { useEffect, useState, memo } from 'react'
import { Link } from 'react-router-dom'
import postService from '../../appwrite/post'

export default memo(function PostCard({ postImg, postId, userId, title, mode, userImg }) {
    const [userimage, setUserImage] = useState(postService.getPreview({fileId:userImg,quality:3}));
    const postImage = postService.getPreview({ fileId: postImg, quality: 70 })
    useEffect(() => {
        if (userimage === null) {
            setUserImage(postService.getPreview({ fileId: '652d183kdgfl755548d9h6f', quality: 5 }))
        }
    }, [])
    return (
        <div className='w-full sm:w-[290px] sm:mx-[8px] md:w-[330px] md:mx-[27px] lg:w-[301px] lg:mx-[20px] xl:w-[290px] xl:mx-[15px] my-4'>
            <Link to={`/post/${postId}`}>
                <img src={postImage} alt="" loading='lazy'
                    className={`w-full sm:rounded-lg md:h-[186px] lg:h-[170px] xl:h-[163px] ${mode === "dark" ? 'bg-gray-700' : 'bg-gray-300'}`}
                />
            </Link>
            <p className={`font-semibold text-sm w-full px-3 py-1 capitalize ${mode === "dark" ? "text-white" : "text-black"}`}>
            {title.length > 50 ? title.slice(0, 47) + "..." : title}
            </p>
            <div className='my-1'>
                <Link
                    to={`/user/${userId}`}
                >
                    <img src={userimage} alt="" loading='lazy'
                        className={`${mode === "dark" ? 'bg-gray-700' : 'bg-gray-300'} rounded-full w-8 h-8 inline`}
                    />
                    <span className='mx-2 inline'>{userId}</span>
                </Link>
            </div>
        </div>
    )
})
