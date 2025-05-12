import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar'
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { logout } from '../redux/userSlice';

const Sidebar = ({ isDarkMode, toggleDarkMode }) => {
    const user = useSelector(state => state?.user)
    const [editUserOpen,setEditUserOpen] = useState(false)
    const [allUser,setAllUser] = useState([])
    const [openSearchUser,setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar',user._id)
            
            socketConnection.on('conversation',(data)=>{
                console.log('conversation',data)
                
                const conversationUserData = data.map((conversationUser,index)=>{
                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser?.sender
                        }
                    }
                    else if(conversationUser?.receiver?._id !== user?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.receiver
                        }
                    }else{
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.sender
                        }
                    }
                })

                setAllUser(conversationUserData)
            })
        }
    },[socketConnection,user])

    const handleLogout = ()=>{
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
    }

  return (
    <div className={`w-full h-full grid grid-cols-[48px,1fr] ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`bg-yellow-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-gray-300 flex flex-col justify-between ${isDarkMode ? 'dark:bg-gray-900 dark:text-gray-300' : 'bg-slate-100 text-slate-600'}`}>
                <div>
                    <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-gray-50"}`} title='chat'>
                        <IoChatbubbleEllipses
                            size={20}
                        />
                    </NavLink>

                    <div title='add friend' onClick={()=>setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' >
                        <FaUserPlus size={20}/>
                    </div>

                    <button 
                        onClick={toggleDarkMode} 
                        className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'
                        title={isDarkMode ? 'Light mode' : 'Dark mode'}
                    >
                        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                    </button>
                </div>

                <div className='flex flex-col items-center'>
                    <button className='mx-auto hover:bg-slate-200' title={user?.name} onClick={()=>setEditUserOpen(true)}>
                        <Avatar
                            width={40}
                            height={40}
                            name={user?.name}
                            imageUrl={user?.profile_pic}
                            userId={user?._id}
                        />
                    </button>
                    <button title='logout' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' onClick={handleLogout}>
                        <span className='-ml-2'>
                            <BiLogOut size={20}/>
                        </span>
                    </button>
                </div>
            </div>

            <div className={`w-full ${isDarkMode ? 'bg-gray-900' : 'bg-yellow-50'}`}>
                <div className={`h-16 flex items-center ${isDarkMode ? 'bg-gray-800' : 'bg-yellow-100'} text-gray-300`}>
                    <h2 className='text-xl font-bold p-4'>Message</h2>
                </div>
                <div className={`bg-slate-200 p-[0.5px]`}>
                </div>

                <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {allUser.length === 0 ? (
                        <div className='h-full flex items-center justify-center flex-col gap-4'>
                            <FiArrowUpLeft
                                size={50}
                            />
                            <p className={`text-lg text-center ${isDarkMode ? 'text-gray-300' : 'text-slate-400'}`}>Explore users to start a conversation with.</p>    
                        </div>
                    ) : (
                        allUser.map((conv,index)=>(
                            <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className={`flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer ${isDarkMode ? 'dark:hover:bg-gray-700 dark:border-gray-700' : ''}`}>
                                <div>
                                    <Avatar
                                        imageUrl={conv?.userDetails?.profile_pic}
                                        name={conv?.userDetails?.name}
                                        width={40}
                                        height={40}
                                    />    
                                </div>
                                <div>
                                    <h3 className={`text-ellipsis line-clamp-1 font-semibold text-base ${isDarkMode ? 'text-gray-300' : ''}`}>{conv?.userDetails?.name}</h3>
                                    <div className={`text-slate-500 text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : ''}`}>
                                        <div className='flex items-center gap-1'>
                                            {conv?.lastMsg?.imageUrl && (
                                                <img
                                                    src={conv?.lastMsg?.imageUrl}
                                                    alt='message image'
                                                    className='w-6 h-6 rounded'
                                                />
                                            )}
                                            <span className={`whitespace-nowrap text-ellipsis line-clamp-1 ${isDarkMode ? 'text-gray-400' : ''}`}>
                                                {conv?.lastMsg?.message}
                                            </span>
                                        </div>
                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : ''}`}>
                                            {new Date(conv?.lastMsg?.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </NavLink>
                        ))
                    )}
                </div>
            </div>

            {editUserOpen && (
                <EditUserDetails onClose={()=>setEditUserOpen(false)} user={user}/>
            )}

            {/**search user */}
            {openSearchUser && (
                <SearchUser onClose={()=>setOpenSearchUser(false)}/>
            )}
    </div>
  )
}

export default Sidebar
