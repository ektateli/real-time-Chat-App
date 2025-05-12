import React from 'react'
import logo from '../assets/gpt.png'

const AuthLayouts = ({children}) => {
  return (
    <>
    <div>
  <header className="flex flex-col justify-center items-center py-3 h-32 shadow-md bg-yellow-50">
    <div className="flex items-center space-x-4">
      <img 
        src={logo}
        alt="logo"
        width={180}
        height={40}
      />
      <h1 className="text-[#ec4899] text-2xl font-bold italic tracking-wide">Chat freely. Connect deeply!</h1>
    </div>
  </header>
</div>



        { children }
    </>
  )
}

export default AuthLayouts
