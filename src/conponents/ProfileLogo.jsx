import React, { memo } from 'react'
import { Link } from 'react-router-dom'


export default memo(function ProfileLogo({className="w-10 h-10",URL,imgURL}) {
  
  return (
  
    <div className={className}>
    <Link to={URL}>
    <img src={imgURL} alt="Logo" className='h-full w-full rounded-full'/>
    </Link>
</div>
  )
})