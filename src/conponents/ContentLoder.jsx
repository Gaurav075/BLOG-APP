import React from 'react'
import EmptyContent from './EmptyContent'

export default function ContentLoder({mode="dark"}) {
  return (
    <div className='flex flex-wrap justify-center'>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
        <EmptyContent mode={mode}/>
    </div>
  )
}
