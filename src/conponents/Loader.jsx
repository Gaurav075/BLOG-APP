import React,{memo} from 'react'
import {useSelector} from 'react-redux'

export default memo(function Loader({home=false}) {
  const mode = useSelector((state)=>state.mode)
  return (
    <div className={`w-screen h-screen fixed top-0 left-0 ${home? mode==="dark" ? "bg-gray-800" : 'bg-gray-100'
    :"bg-[#c7d8d964]"} grid place-content-center`}>
        <span className="loader block"></span>
    </div>
  )
})
