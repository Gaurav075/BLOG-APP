import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import postService from '../appwrite/post';
import authService from '../appwrite/auth';
import Loader from './Loader';
import PostCard from './postComponents/PostCard';
import { logout } from '../store/authSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import ContentLoder from './ContentLoder';

export default function Profile() {

  const navigate = useNavigate();
  const { userid } = useParams();
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.status);
  const user = useSelector((state) => state.userData);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserAccount,setIsUserAccount] = useState(false);
  const [myPost, setMypost] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  const Logout=()=>{
    if (localStorage.getItem("sessionId")!==null) {
      authService.deleteSession(localStorage.getItem("sessionId"))
      .then((responce)=>{
        if (responce) {
          localStorage.removeItem("sessionId");
          dispatch(logout());
          navigate('/');
        }
      })
    } else {
      authService.logout()
      .then((responce)=>{
        if (responce) {
          dispatch(logout());
          navigate('/');
        }
      })
    }
  }

  const fetchPost =async()=>{
    setLoading(true)
      postService.getAllPost({key:"userId",value:userid,offset:myPost.length})
      .then((data)=>{
        if (data) {
          setMypost(data.documents);
          setTotalPosts(data.total)
        }
      }).finally(()=>setLoading(false))
  }

  useEffect(() => {
    authService.getUserData(userid)
      .then((data) => {
        if (data) {
          setUserData(data)
          fetchPost();
        } else {
          navigate('/error')
        }
      })
  }, [userid])

  useEffect(() => {
      if (user!==null) {
        if (user.$id===userid && authStatus) {
          setIsUserAccount(true);
        }
      }
  
  }, [authStatus,user,isUserAccount,userid])

  return !loading ? (
    <div className={`w-full z-0 py-20 min-h-screen ${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <img src={postService.getPreview({ fileId:userData.photo, quality: 70 })} alt="logo" className='w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw]
      md:w-[30vw] md:h-[30vw]
      lg:w-[20vw] lg:h-[20vw] rounded-full block mx-auto p-2 border-4 border-green-600'/>
      <p className={`${mode === "dark" ? "text-white" : "text-black"} text-center text-2xl mt-3 font-bold`}>{userData.fullName ? userData.fullName : userData.$id}</p>
      <p className={`${mode === "dark" ? "text-gray-400" : "text-gray-700"} text-center font-semibold`}>{userData.about ? userData.about : ""}</p>
      {
        userData.public || isUserAccount ? <div>
          <div className='w-full p-6 mx-auto my-4 sm:w-[86%] md:w-[60%]'>
            {userData.fullName ? <p>Full Name : {userData.fullName}</p> : null}
            <p>👤Username : {userData.$id}</p>
            {userData.email ? <p>✉️ Email : <a href={`mailto:${userData.email}`} className='hover:underline'>{userData.email}</a></p> : null}
            {userData.phone ? <p>📞 Phone : {userData.phone}</p> : null}
            {userData.address ? <p>🏠 Location : {userData.address}</p> : null}
            {userData.hobby ? <p>🏓 Hobbys : {userData.hobby}</p> : null}
            {isUserAccount ? <div
            className='flex justify-between flex-nowrap mt-6'
            ><Link
              to={`/edit-profile/${userid}`}
            className={`block rounded-lg text-center h-12 py-3 px-4 bg-blue-600 text-white font-semibold hover:bg-blue-500`}
            >
              Edit Profile
            </Link>
            <button onClick={Logout}
            className={`block rounded-lg text-center h-12 py-3 px-4 bg-blue-600 text-white font-semibold hover:bg-blue-500`}
            >
              Log out
            </button>
            </div> : null}
          </div>
          <h2
            className={`${mode === "dark" ? "text-white" : "text-black"} text-2xl text-center font-bold mb-4`}
          >{isUserAccount ? "My Posts" : `posts Created by ${userData.fullName? userData.fullName : userData.userName}`}</h2>
          <InfiniteScroll
                  dataLength={myPost.length} 
                  next={fetchPost}
                  hasMore={myPost.length < totalPosts? true : false}
                  loader={<ContentLoder mode={mode}/>}
                  endMessage={
                    myPost.length === 0 ? <div className='grid place-content-center w-full py-40 text-2xl font-semibold'>No Post yet 😭</div> :
                    <p style={{ textAlign: 'center' }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
          >
          <div className='flex flex-wrap justify-center'>
            {
              myPost.map((post) => {
               return <PostCard key={post.$id} postImg={post.featuredImage} postId={post.$id} userId={post.userId} title={post.title} mode={mode}
                userImg={userData.photo} />
              })}
          </div>
          </InfiniteScroll>
              

        </div> :
          <div className={`text-red-800 text-center font-semibold text-2xl mx-auto my-8`}>
            This Account is Private!
          </div>
      }
    </div>
  ) : <Loader home={true} />
}
