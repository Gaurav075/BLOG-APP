import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import postService from '../../appwrite/post';
import Loader from '../Loader';
import parse from 'html-react-parser'
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './PostCard';
import authService from '../../appwrite/auth';
import { setMetaData } from '../../store/authSlice';
import LoadingBar from 'react-top-loading-bar'

export default function PostLayout() {
  const { postid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.userMetaData);
  const [currentPost, setCurrentPost] = useState(null)
  const [relatedPost, setRelatedPost] = useState([]);
  const [totalResults, setTotalResults] = useState(0)
  const [isMyPost, setIsMyPost] = useState(false);
  const [isLiked, setIsliked] = useState(false)
  const [isDisiked, setIsDisliked] = useState(false)
  const [totalLikes, setTotalLikes] = useState(0)
  const [totalDisLikes, setTotalDisLikes] = useState(0)
  const [progress, setProgress] = useState(0)


  const fetchData = () => {
    postService.getAllPost({ key: "status", value: "active", offset: relatedPost.length })
      .then((data) => {
        if (data) {
          setRelatedPost(relatedPost.concat(data.documents));
          setTotalResults(data.total);
        }
      })
  }

  const addLike = () => {
    if (!isLiked && !isDisiked) {
      setIsliked(true);
      setTotalLikes(totalLikes + 1);
      const arr = JSON.parse(user.liked)
      arr.push(postid);
      let stringArr = JSON.stringify(arr);
      authService.updateUserData({ liked: stringArr }, user.$id)
        .then(() => {
          dispatch(setMetaData({ ...user, liked: stringArr }))
          postService.updateLikeandDislikes({ slug: postid, likes: currentPost.likes + 1, dislikes: currentPost.dislikes })
        })
    } else if (isLiked && !isDisiked) {
      setIsliked(false);
      setTotalLikes(totalLikes - 1);
      let arr = user.liked.replace(postid, "");
      authService.updateUserData({ liked: arr }, user.$id)
        .then(() => {
          dispatch(setMetaData({ ...user, liked: arr }))
          postService.updateLikeandDislikes({ slug: postid, likes: currentPost.likes - 1, dislikes: currentPost.dislikes })
        })
    } else if (isDisiked || !isLiked) {
      setIsDisliked(false);
      setIsliked(true);
      setTotalLikes(totalLikes + 1);
      setIsDisliked(totalDisLikes - 1);
      let arr = JSON.parse(user.liked)
      arr.push(postid);
      let stringArr = JSON.stringify(arr);
      let arr2 = user.disliked.replace(postid, "");
      authService.updateUserData({ liked: stringArr, disliked: arr2 }, user.$id)
        .then(() => {
          dispatch(setMetaData({ ...user, liked: stringArr, disliked: arr2 }))
          postService.updateLikeandDislikes({ slug: postid, likes: currentPost.likes + 1, dislikes: currentPost.dislikes - 1 })
        })

    }
  }

  const addDisLike = () => {
    if (!isLiked && !isDisiked) {
      setIsDisliked(true);
      setTotalDisLikes(totalDisLikes + 1);
      const arr = JSON.parse(user.disliked)
      arr.push(postid);
      let stringArr = JSON.stringify(arr);
      authService.updateUserData({ disliked: stringArr }, user.$id)
        .then(() => {
          dispatch(setMetaData({ ...user, disliked: stringArr }))
          postService.updateLikeandDislikes({ slug: postid, likes: currentPost.likes, dislikes: currentPost.dislikes + 1 })
        })
    } else if (isDisiked && !isLiked) {
      setIsDisliked(false);
      setTotalDisLikes(totalDisLikes - 1);
      let arr = user.disliked.replace(postid, "");
      authService.updateUserData({ disliked: arr }, user.$id)
        .then(() => {
          dispatch(setMetaData({ ...user, disliked: arr }))
          postService.updateLikeandDislikes({ slug: postid, likes: currentPost.likes, dislikes: currentPost.dislikes - 1 })
        })
    } else if (isLiked && !isDisiked) {
      setIsliked(false);
      setIsDisliked(true);
      setTotalLikes(totalLikes - 1);
      setIsDisliked(totalDisLikes + 1);
      let arr = JSON.parse(user.disliked)
      arr.push(postid);
      let stringArr = JSON.stringify(arr);
      let arr2 = user.liked.replace(postid, "");
      authService.updateUserData({ liked: arr2, disliked: stringArr }, user.$id)
        .then(() => {
          dispatch(setMetaData({ ...user, liked: arr2, disliked: stringArr }))
          postService.updateLikeandDislikes({ slug: postid, likes: currentPost.likes - 1, dislikes: currentPost.dislikes + 1 })
        })

    }
  }

  const deletePost = () => {
    let x = confirm("Do you want to Delete this Post?")
    if (x) {
      setProgress(40)
      postService.deletePost({ slug: postid })
        .then((responce) => {
          if (responce) {
            setProgress(100)
            navigate('/')
          } else {
            setProgress(100)
            navigate('/error')
          }
        })
    } else {
      return
    }
  }

  useEffect(() => {
    setProgress(50)
    postService.getPost({ slug: postid })
      .then((post) => {
        if (post) {
          setCurrentPost(post)
          setTotalLikes(post.likes)
          setTotalDisLikes(post.dislikes);
          setLoading(false);
          setProgress(100)
        } else {
          setProgress(100)
          navigate('/error')
        }
      }).then(() => fetchData())
  }, [postid])

  useEffect(() => {
    if (user !== null && currentPost !== null) {
      if (user.$id === currentPost.userId) {
        setIsMyPost(true);
      }
      if (user.liked.includes(postid)) {
        setIsliked(true);
      } else if (user.disliked.includes(postid)) {
        setIsDisliked(true);
      }
    }
  }, [user, isMyPost, currentPost, postid])
  return (!loading ?
    <div className={`w-screen min-h-screen pt-16 pb-0 z-0
    ${mode === "dark" ? "text-white bg-gray-800" : "bg-gray-100 text-black"} lg:flex lg:flex-nowrap lg:justify-between lg:px-10`}>
      <LoadingBar
        color='#ff0000'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <div className={`w-full sm:w-[90%] sm:mx-auto md:w-[70%] lg:w-[610px] xl:w-[880px] ${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} rounded-2xl lg:mx-0 lg:h-[90vh] overflow-auto`}>
        <img src={postService.getPreview({ fileId: currentPost.featuredImage, quality: 70 })} alt=""
          className={`w-full h-auto ${mode === "dark" ? 'bg-gray-700' : 'bg-gray-300'} rounded-t-2xl`}
        />
        <p className='text-xl font-semibold p-3'>
          {currentPost.title}
        </p>
        <div className='px-5 break-all overflow-auto pb-4'>
          Content : <br />
          {parse(currentPost.content)}
        </div>
        <div className={`pt-3 pb-5 mb-3 h-16`}>
          <button className={`float-left ml-8 mr-3 text-[10px] ${isLiked ? "text-blue-500" : ""}`} title='like'
            disabled={user===null? true : false}
            onClick={addLike}
          >
            <span className="material-symbols-outlined">thumb_up</span><br />{totalLikes}
          </button>

          <button className={`float-left mx-3 text-[10px] ${isDisiked ? "text-blue-500" : ""}`}
            disabled={user===null? true : false}
            onClick={addDisLike}
          >
            <span className="material-symbols-outlined" title='dislike'>thumb_down</span><br />{totalDisLikes}
          </button>
          {isMyPost ?
            <button className='float-right ml-4 mr-8' title='Delete Post' onClick={deletePost}>
              <span className="material-symbols-outlined">delete</span>
            </button> : null}
          {isMyPost ?
            <Link to={`/edit-post/${postid}`} className='float-right mx-2' title='Edit Post'>
              <span className="material-symbols-outlined">edit</span>
            </Link> : null}
        </div>
      </div>



      <div className={`w-full lg:w-[342px] xl:w-[332px] ${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}
         rounded-2xl lg:mx-0 mt-5 lg:mt-0 min-[850px]:w-[768px] min-[850px]:mx-auto lg:h-[90vh] overflow-auto`}>
        <p className='text-center text-lg font-semibold py-3'>Related Posts</p>
        <InfiniteScroll
          dataLength={relatedPost.length} //This is important field to render the next data
          next={fetchData}
          hasMore={relatedPost.length < totalResults ? true : false}
          loader={<div className='w-full h-full grid place-content-center'>
            <p >Loading...</p>
          </div>}
          endMessage={
            relatedPost.length === 0 ? <div className='grid place-content-center w-full py-40 text-2xl font-semibold'>No Result Found 😭</div> :
              <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                <b>Yay! You have seen it all</b>
              </p>
          }
        >
          <div className='flex flex-wrap justify-center'>
            {
              relatedPost.map((post) => {
                return <PostCard key={post.$id} postImg={post.featuredImage} postId={post.$id} userId={post.userId} title={post.title} mode={mode}
                  userImg={post.author} />
              })

            }
          </div>
        </InfiniteScroll>

      </div>
    </div>
    : <Loader home={true} />
  )
}
