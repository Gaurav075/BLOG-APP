import React,{forwardRef, useId, memo} from 'react'

function Input({lable,mode,type,error,className="",...props},ref) {
    const id=useId()
  return (
    <div className={className}>
        <label htmlFor={id} className={`block my-3 text-center tect-xl font-semibold mx-auto w-full ${mode==="dark"? "text-white" : "text-black"}`}>{lable}</label>
        <input type={type} id={id} className={`block rounded-lg w-[90%] mx-auto h-10 py-3 px-4 ${mode==="dark"? "bg-gray-700 text-white"
        : "bg-gray-200 text-black"}`} {...props} ref={ref} />
        <p className='text-red-600 w-[90%] mx-auto text-sm pt-1'>{error}</p>
    </div>
  )
}
export default memo(forwardRef(Input));