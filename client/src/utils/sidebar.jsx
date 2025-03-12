import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import useThemeStore from '../components/store/themestore';
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [role, setrole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isDarkTheme, toggleTheme } = useThemeStore();
    
    const navigate = useNavigate();

    useEffect(() => {
        const getRole = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login"); 
                return;
            }
            try {
                const decodedToken = jwtDecode(token);
                setrole(decodedToken.role);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token");
                navigate("/login"); 
            }
            setIsLoading(false);
        };
        getRole();
    }, [navigate]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkTheme);
    }, [isDarkTheme]);
 
    const togglesidebar = () => {
        setIsOpen(!isOpen);
    };

    const[select,setselect]=useState(()=>{
        const path=window.location.pathname;
        if(path==="/dashboard") return 0;
        if(path==="/profile") return 1;
        if(path==="/telecallers") return 2;
        if(path==="/report") return 3;
        if(path==="/messages") return 4;
        if(path==="/settings") return 5;
        if(path==="/history") return 6;
        if(path==="/leads") return 8
        if(path=="/admins") return 9;
        if(path=="/admindashboard") return 10;
        if(path=="/callback") return 20;
    });

    const signout=()=>{
        console.log("fsv")
        localStorage.removeItem("token");
        navigate("/login")
    }

    useEffect(() => {
        const currentPath = window.location.pathname;
    
        switch (select) {
          case 0:
            if (currentPath !== "/dashboard") navigate("/dashboard");
            break;
          case 1:
            if (currentPath !== "/profile") navigate("/profile");
            break;
          case 2:
            if (currentPath !== "/telecallers") navigate("/telecallers");
            break;
          case 3:
            if (currentPath !== "/report") navigate("/report");
            break;
          case 4:
            if (currentPath !== "/messages") navigate("/messages");
            break;
          case 5:
            if (currentPath !== "/settings") navigate("/settings");
            break;
          case 6:
            if (currentPath !== "/history") navigate("/history");
            break;
          case 8:
            if(currentPath!=='/leads') navigate("/leads");
            break;
          case 9:
            if(currentPath!=='/admins') navigate("/admins");
            break;
          case 10:
            if(currentPath!=='/admindashboard') navigate("/admindashboard");
            break;
          case 20:
            if(currentPath!=="/callback") navigate("/callback");
            break;  
          default:
            break;
        }
    }, [select, navigate]);

    if (isLoading) {
        return null;
    }

    return (
        <>
            <div className="relative h-screen m-0 p-0">
                <button
                    className={`lg:hidden absolute top-4 left-4 p-2 rounded-full mt-1 ${
                        isOpen ? 'text-white' : 'text-white'
                    } z-20`}
                    onClick={togglesidebar}
                >
                   <i className='fa fa-bars'></i>
                </button>
                <div
                    className={`w-[250px] h-full ${isDarkTheme ? 'bg-[rgba(23,24,33,1)]' : 'bg-white'} fixed top-0 left-0 z-10 transition-all duration-300 ease-in-out ${
                        isOpen ? 'transform-none w-[160px]' : '-translate-x-full'
                    } lg:translate-x-0 border-r ${isDarkTheme ? 'border-gray-500' : 'border-gray-200'}`}
                >
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${isDarkTheme ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
                        >
                            <i className={`fas ${isDarkTheme ? 'fa-sun' : 'fa-moon'}`}></i>
                        </button>
                    </div>

                    <div className="absolute top-20 left-5 flex flex-col space-y-10">
                        {role=="superadmin" && <div onClick={()=>setselect(10)} className={`flex items-center cursor-pointer ${select===10?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-cogs fa-2x mr-4 ${select===10?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===10?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Dashboard</h2>
                        </div>}
                        {role!=="superadmin" && <div onClick={()=>setselect(0)} className={`flex items-center cursor-pointer ${select===0?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-cogs fa-2x mr-4 ${select===0?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===0?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Dashboard</h2>
                        </div>}
                        <div onClick={()=>setselect(1)} className={`flex items-center cursor-pointer ${select===1?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-user-plus fa-2x mr-4 ${select===1?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===1?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Profile</h2>
                        </div>
                        {role=="superadmin" && <div onClick={()=>setselect(9)} className={`flex items-center cursor-pointer ${select===9?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-user-shield fa-2x mr-4 ${select===9?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===9?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Admins</h2>
                        </div>}
                        {role!=="telecaller" && role!=="superadmin" && <div onClick={()=>setselect(2)} className={`flex items-center cursor-pointer ${select===2?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-phone fa-2x mr-4 ${select===2?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===2?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Telecallers</h2>
                        </div>}
                        {role!=="superadmin" && <div onClick={()=>setselect(8)} className={`flex items-center cursor-pointer ${select===8?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-user-tie fa-2x mr-4 ${select===8?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===8?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Leads</h2>
                        </div>}
                        {role!=="superadmin" && <div onClick={()=>setselect(3)} className={`flex items-center cursor-pointer ${select===3?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-chart-line fa-2x mr-4 ${select===3?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===3?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Report</h2>
                        </div>}
                        {role==="telecaller" && <div onClick={()=>setselect(6)} className={`flex items-center cursor-pointer ${select===6?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-history fa-2x mr-4 ${select===6?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===6?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>History</h2>
                        </div>}
                        {role==="telecaller" && <div onClick={()=>setselect(20)} className={`flex items-center cursor-pointer ${select===20?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-history fa-2x mr-4 ${select===20?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===20?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Callback</h2>
                        </div>}
                        <div onClick={signout} className={`flex items-center cursor-pointer ${select===7?'bg-mint-green p-3 rounded': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                            <i className={`fas fa-sign-out-alt fa-2x mr-4 ${select===7?'text-black': isDarkTheme ? 'text-grey' : 'text-gray-600'}`}></i>
                            <h2 className={`text-2xl ${select===7?'font-bold text-black': isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Signout</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;