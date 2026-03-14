import { useContext, useState, type ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Home, Logout, Settings, UsersGroupRounded, type IconProps, CloseCircle, SidebarMinimalistic, Bookmark, User } from "@solar-icons/react";
import { useOutsideClick } from "../../customHooks/useOutsideClick";
import { AuthContext } from "../../contexts/AuthContextValue";
import { AuthCTA } from "../authCTA/AuthCTA";

export interface Link {
    id: number; label: string; icon: ReactElement<IconProps>, link: string, subtext?: string
}

function Sidebar() {
    const [open, setOpen] = useState(false)
    const pathname = useLocation().pathname;
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const generalLinks: Link[] = [
        { id: 0, label: "Dashboard", icon: <Home size={16} />, link: "/account/dashboard" },
        { id: 1, label: "Leads", icon: <Bookmark size={16} />, link: "/account/leads" },
        { id: 2, label: "Clients", icon: <UsersGroupRounded size={16} />, link: "/account/clients" },
        { id: 3, label: "Profile", icon: <User size={16} />, link: "/account/profile" },
        { id: 4, label: "Messages", icon: <Bell size={16} />, link: "/account/notifications", subtext: "2" },
        { id: 5, label: "Settings", icon: <Settings size={16} />, link: "/account/settings" },
        { id: 6, label: "Logout", icon: <Logout size={16} />, link: "#" },
    ]
    
    const modalRef = useOutsideClick(setOpen, false)

    return (
        <div className={`md:sticky top-0 left-0 h-screen w-0 duration-500 ${open ? "sm:w-[104px]": "sm:w-[300px]"}`}>
            <button className={`md:absolute fixed top-5 md:right-4 md:left-auto flex flex-col justify-center items-center sm:bg-gray/[0.09] bg-background backdrop-blur-md gap-1 w-5 h-6 z-[50] p-[2px] px-[13px] rounded-full duration-500 ${open ? " left-[280px] max-[500px]:left-[230px]" : "left-4"}`} onClick={() => setOpen(!open)}>
                { open ?
                <CloseCircle size={24} color="currentColor" weight="LineDuotone" />
                :
                <SidebarMinimalistic size={20} color="currentColor" />
                }
            </button>

            <div  className={`fixed top-0 left-0 md:hidden bg-[#000]/[0.5] ${open ? "w-full h-full" : "w-0 h-full"}`}></div>
            <div ref={modalRef} className={`flex flex-col justify-between md:h-full sm:bg-gray/[0.05] bg-background h-[100vh] md:sticky fixed md:shadow-none shadow-lg md:top-0 top-0 py-4 px-4 left-0 overflow-y-auto overflow-x-hidden z-[5] transition-all duration-700 ${open ? "sm:w-[74px] w-[320px] max-[500px]:w-[270px] translate-x-[0px] opacity-[1]": "sm:w-full translate-x-[-400px] md:translate-x-[0px] md:opacity-[1] opacity-[0]"}`}>  
                <Link to={"/"} className={`flex items-center mb-2 p-1 gap-1 pt-[6px] pb-5 border-b border-gray/[0.1] ${open ? "sm:p-1 pb-5 sm:w-11 sm:h-11 sm:justify-center sm:aspect-square sm:bg-slate-100 rounded" : ""}`}>
                    <img src="/logo.svg" width={12} height={20} alt="logo" className={``} />
                    <h3 className={`font-bold uppercase duration-500 ${open ? "sm:hidden" : ""}`}>Flashleads</h3>
                </Link>

                {/* Navigation Links */}
                <div className="flex-1 flex flex-col gap-1 text-[14px]">
                    <h1 className={`opacity-[0.4] p-3 text-[14px] uppercase ${open ? "opacity-[1] md:opacity-[0]" : ""}`}>General</h1>
                    <div className="flex flex-col gap-[1px]">
                        {
                        generalLinks.map(link => {
                            if (link.label === 'Profile') {
                                return (
                                <>
                                    <h1 className={`opacity-[0.4] p-3 pt-4 text-[14px] uppercase mt-4 border-t border-gray/[0.2] ${open ? "opacity-[1] md:opacity-[0]" : ""}`}>Others</h1>
                                    <Link key={link.id} onClick={() => setOpen(false)} to={ link.link} className={`relative flex items-center justify-between px-3 py-3 h-[48px] rounded-[6px] duration-300 ${pathname.includes(link.link) ? "sm:bg-background bg-gray-100/[0.2] font-bold" : "font-semibold opacity-75 hover:bg-gray-100/[0.2]"}`}>
                                        {pathname.includes(link.link) ? <span className="absolute -left-[2px] w-[3px] h-6 rounded bg-black  dark:bg-primary"></span>: ""}
                                        <div className="flex items-center gap-3">
                                            <span className={`w-[18px] ${pathname.includes(link.link) ? "opacity-100" : ""}`}>{link.icon}</span>
                                            <span className={`flex-1 py-1 break-normal duration-500 ${open ? "sm:hidden" : ""}`}>{link.label} </span>
                                        </div>
                                        { link.subtext ? <span className="flex items-center justify-center bg-green-400 leading-[100%] text-white text-[10px] rounded-full px-[6px] py-1">{link.subtext}</span> : ""}
                                    </Link>
                                </>
                                )
                            }
                            if (link.label === 'Logout') {
                                    return (
                                        <button
                                            key={link.id}
                                            onClick={async () => { setOpen(false); await logOut(); navigate('/login'); }}
                                            className={`relative w-full text-left flex items-center justify-between px-3 py-1 h-[48px] rounded-[6px] duration-300 cursor-pointer ${pathname.includes(link.link) ? "sm:bg-background bg-gray-100/[0.2] font-bold text-primary" : "font-semibold opacity-75 hover:bg-gray-100/[0.2]"}`}>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-[18px] ${pathname.includes(link.link) ? "text-primary opacity-100" : ""}`}>{link.icon}</span>
                                                <span className={`flex-1 py-1 break-normal duration-500 ${open ? "sm:hidden" : ""}`}>{link.label} </span>
                                            </div>
                                        </button>
                                    )
                                }
                                return (
                                <Link key={link.id} onClick={() => setOpen(false)} to={ link.link} className={`relative flex items-center justify-between px-3 py-3 h-[48px] rounded-[6px] duration-300 ${pathname.includes(link.link) ? "sm:bg-background bg-gray-100/[0.2] font-bold" : "font-semibold opacity-75 hover:bg-gray-100/[0.2]"}`}>
                                    {pathname.includes(link.link) ? <span className="absolute -left-[2px] w-[3px] h-6 rounded bg-black dark:bg-primary"></span>: ""}
                                    <div className="flex items-center gap-3">
                                        <span className={`w-[18px] ${pathname.includes(link.link) ? "opacity-100" : ""}`}>{link.icon}</span>
                                        <span className={`flex-1 py-1 break-normal duration-500 ${open ? "sm:hidden" : ""}`}>{link.label} </span>
                                    </div>
                                    { link.subtext ? <span className="flex items-center justify-center bg-green-400 leading-[100%] text-white text-[10px] rounded-full px-[6px] py-1">{link.subtext}</span> : ""}
                                </Link>
                                )
                        })
                        }
                    </div>
                </div>

                {/* User Info & Theme Toggle */}
                <div className="flex flex-col gap-3 pt-4 mt-4">

                    {/* User Info */}
                    {user && (
                        <div className={`flex items-center gap-3 border border-gray/[0.1] bg-background rounded ${open ? "p-0 rounded-full" : "p-2"}`}>
                            <AuthCTA user={user} />
                            
                            {/* User Details */}
                            <div className={`flex-1 min-w-0 ${open ? "sm:hidden" : ""}`}>
                                <p className="font-medium  mb-1">
                                    <span className=" capitalize">{user?.fullname || user?.displayName || user?.email?.split('@')[0]}</span>
                                </p>
                                <p className="text-xs opacity-[0.6] dark:text-gray-400 truncate">
                                    {user.email || ''}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
