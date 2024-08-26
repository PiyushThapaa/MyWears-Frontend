import React from 'react';

const Loader = () => {
  return (
    <div className=' h-screen flex justify-center items-center bg-slate-950/20'>
      <div
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status">
    <span
      className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >Loading...</span>
  </div>
    </div>

// height: 100vh;
//     display: flex;
//     justify-content: center;
//     /* align-items: center; */
//     padding-top: 14rem;
//     background-color: rgba(0, 0, 0, 0.1);


  );
}
export default Loader