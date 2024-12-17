import React from 'react'
import {useSelector} from 'react-redux'

export default function () {
    const mode=useSelector((state)=>state.mode)
  return (
    <div className={`grid place-content-center w-screen h-screen ${mode==="dark"? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
        <div>
            <p className='text-center mx-auto text-[50px]'>😥</p>
            <h1 className='text-center mx-auto text-3xl'>Oops..!</h1>
            <p className='text-center mx-auto text-lg'>Page not Found.</p>
        </div>
    </div>
  )
}
