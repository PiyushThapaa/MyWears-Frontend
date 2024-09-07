import React from 'react'

const SkeletonLoader = () => {
  return (
    <div className="w-64 rounded overflow-hidden shadow-lg m-4">
  <div className="w-full bg-gray-400 h-40 animate-pulse"></div>
  <div className="px-6 py-4 bg-gray-500 flex justify-between items-center animate-pulse">
    <div>
      <div className="bg-gray-400 h-6 w-32 mb-2"></div>
      <div className="bg-gray-400 h-4 w-20"></div>
    </div>
    <div className="bg-gray-400 h-8 w-8 rounded-full"></div>
  </div>
</div>
  )
}

export default SkeletonLoader