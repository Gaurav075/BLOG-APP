import React,{memo} from 'react'

export default memo(function PostCard({mode="dark"}) {

    return (
        <div className='w-screen sm:w-[290px] sm:mx-[8px] md:w-[330px] md:mx-[27px] lg:w-[301px] lg:mx-[20px] xl:w-[290px] xl:mx-[15px] my-4'>
                <div
                    className={`w-full sm:rounded-lg md:h-[186px] lg:h-[170px] xl:h-[163px] ${mode === "dark" ? 'bg-gray-700' : 'bg-gray-300'}`}
                ></div> 
           
            <p className={`font-semibold w-[90%] h-5 rounded-3xl my-3 ${mode === "dark" ? "bg-gray-700" : "bg-gray-300"}`}>
                
            </p>
            <div className='my-0 w-full h-8 flex'>
                    <span
                        className={`${mode === "dark" ? 'bg-gray-700' : 'bg-gray-300'} rounded-full w-8 h-8 block`}
                    ></span>
                    <span className={`${mode === "dark" ? 'bg-gray-700' : 'bg-gray-300'} ml-3 rounded-3xl w-[65%] h-4 mt-2 block`}></span>
            </div>
        </div>
    )
})
