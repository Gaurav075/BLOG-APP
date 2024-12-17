import React, { useEffect, useState, useRef } from 'react'
import { PostCard, ContentLoder } from '../conponents/export'
import postService from '../appwrite/post'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const [Posts, setPosts] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const mode = useSelector((state) => state.mode);
  const authStatus = useSelector((state) => state.status);
  const ref = useRef(null);

  const fetchData=()=>{
    setLoading(true);
    postService.getAllPost({ key: "status", value: "active",offset:Posts.length})
    .then((data) => {
      if (data) {
        setPosts(Posts.concat(data.documents));
        setTotalResults(data.total);
      }
    })
    .finally(() => setLoading(false))
  }

  const search = async () => {
    setLoading(true);
    const value = ref.current.value;
    const post = await postService.getAllPost({ key:"title", value:value.trim().toLowerCase()})
    if (post) {
      setPosts(post.documents);
      setTotalResults(post.total)
      setLoading(false)
    } else {
      setPosts([]);
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <div className={`w-full z-0 py-16 min-h-screen ${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <div className='flex flex-nowrap justify-center'>
        <input type="search" name="search" placeholder='search' ref={ref}
          className={`rounded-3xl w-[75vw] sm:w-[60vw] md:w-[50vw] lg:w-40vw text-sm h-10 pl-5 pr-3 py-2 ${mode === "dark" ? "bg-gray-600 text-white" :
            "bg-gray-300 text-black"}`}
        />
        <button className='mx-3 pt-2' title='search' onClick={search}>
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
      {!authStatus ? <p className='text-center my-2'>
        Please Login To Create Post
      </p> : null}
      {
        loading ? <div className={`w-full z-0 py-16 min-h-screen ${mode === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
          <ContentLoder mode={mode} />
        </div> :
        <InfiniteScroll
        dataLength={Posts.length} //This is important field to render the next data
        next={fetchData}
        hasMore={Posts.length<totalResults? true : false}
        loader={<ContentLoder mode={mode}/>}
        endMessage={
          Posts.length === 0 ? <div className='grid place-content-center w-full py-40 text-2xl font-semibold'>No Result Found 😭</div> :
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        >
            <div className='flex flex-wrap justify-center'>
              {
                Posts.map((post) => {
                  return <PostCard key={post.$id} postImg={post.featuredImage} postId={post.$id} userId={post.userId} title={post.title} mode={mode}
                  userImg={post.author} />
                })
                
              }
            </div>
          </InfiniteScroll>

      }
    </div>
  )
}
