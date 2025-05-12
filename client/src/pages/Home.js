import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import MessagePage from '../components/MessagePage'
import logo from '../assets/gpt.png'
import io from 'socket.io-client'

const Home = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    console.log('user',user)
    const fetchUserDetails = async()=>{
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
            const response = await axios({
              url : URL,
              withCredentials : true
            })

            dispatch(setUser(response.data.data))

            if(response.data.data.logout){
                dispatch(logout())
                navigate("/email")
            }
            console.log("current user Details",response)
        } catch (error) {
            console.log("error",error)
        }
    }

    useEffect(()=>{
        fetchUserDetails()
    },[])

    /***socket connection */
    useEffect(()=>{
        const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
          auth : {
            token : localStorage.getItem('token')
          },
        })

        socketConnection.on('onlineUser',(data)=>{
          console.log(data)
          dispatch(setOnlineUser(data))
        })

        dispatch(setSocketConnection(socketConnection))

        return ()=>{
          socketConnection.disconnect()
        }
    },[])


    const basePath = location.pathname === '/'
    return (
        <div className={`grid lg:grid-cols-[300px,1fr] h-screen max-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <section className={`bg-white ${!basePath && "hidden"} lg:block ${isDarkMode ? 'dark:bg-gray-900' : ''}`}>
                <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            </section>

            {/**message component**/}
            <section className={`${basePath && "hidden"} ${isDarkMode ? 'dark:bg-gray-800' : ''}`}>
                <Routes>
                    <Route path="/" element={<div />} />
                    <Route path="/:userId" element={<MessagePage isDarkMode={isDarkMode} />} />
                </Routes>
            </section>

            <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"} ${isDarkMode ? 'dark:bg-gray-900' : ''}`}>
                <div>
                    <img
                        src={logo}
                        width={250}
                        alt='logo'
                    />
                </div>
                <p className={`text-xl mt-2 ${isDarkMode ? 'dark:text-gray-300' : 'text-slate-500'}`}>Select user to send message</p>
            </div>
        </div>
    )
}

export default Home
