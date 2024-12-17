import React,{memo} from 'react'

function Button({type,chlidren,className,...props}) {
  return (
    <button type={type} className={className} {...props}>
        {chlidren}
    </button>
  )
}
export default memo(Button);