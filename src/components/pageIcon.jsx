import React from 'react'

const PageIcon = ({page, onClick}) => {
  return (
    <div className='m-1 w-10 h-10 border rounded flex items-center justify-center cursor-pointer bg-blue-300 text-fuchsia-100 flex-wrap' onClick={onClick}>
        {page}
    </div>
  )
}

export default PageIcon