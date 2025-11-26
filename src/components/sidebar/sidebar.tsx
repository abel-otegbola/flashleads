'use client'
import { useContext, useState, type ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AltArrowDown, Bell, Home, Logout, Server, Settings, UsersGroupRounded, WidgetAdd, type IconProps, CloseCircle, SidebarMinimalistic, Case, MoneyBag } from "@solar-icons/react";
import { useOutsideClick } from "../../customHooks/useOutsideClick";
import { AuthContext } from "../../contexts/AuthContextValue";

export interface Link {
    id: number; label: string; icon: ReactElement<IconProps>, link: string, subtext?: string
}

function Sidebar() {
    const [open, setOpen] = useState(false)
    const [projectsOpen, setprojectsOpen] = useState(false)
    const pathname = useLocation().pathname;
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    // Get user's initials for avatar
    const getUserInitial = () => {
        if (user?.firstname && typeof user.firstname === 'string') {
            return user.firstname.charAt(0).toUpperCase();
        } else if (user?.email && typeof user.email === 'string') {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const generalLinks: Link[] = [
        { id: 0, label: "Dashboard", icon: <Home size={16} />, link: "/account/dashboard" },
        { id: 2, label: "Leads", icon: <Server size={16} />, link: "/account/leads" },
        { id: 1, label: "Clients", icon: <UsersGroupRounded size={16} />, link: "/account/clients" },
        // projects will render its children when toggled
        { id: 3, label: "Projects", icon: <Case size={16} />, link: "/account/projects" },
        { id: 4, label: "Integrations", icon: <WidgetAdd size={16} />, link: "/account/integrations" },
    ]
    
    const projectsLinks: Link[] = [
        { id: 0, label: "Budgets", icon: <MoneyBag size={14} />, link: "/account/projects/budgets" },
    ]
    
    const otherLinks: Link[] = [
        { id: 0, label: "Notifications", icon: <Bell size={16} />, link: "/account/notifications" },
        { id: 1, label: "Settings", icon: <Settings size={16} />, link: "/account/settings" },
        // Logout is handled specially to run the logout effect
        { id: 2, label: "Logout", icon: <Logout size={16} />, link: "#" },
    ]
    const modalRef = useOutsideClick(setOpen, false)

    return (
        <div ref={modalRef} className={`md:sticky top-0 left-0 h-screen w-0 duration-500 ${open ? "sm:w-[104px]": "sm:w-[250px]"}`}>
            <button className={`md:absolute fixed sm:top-4 top-3 md:right-4 right-5 flex flex-col justify-center items-center bg-white/[0.7] dark:bg-dark-bg/[0.7] backdrop-blur-md gap-1 w-5 h-8 z-[50] p-[2px] px-[13px] rounded-full`} onClick={() => setOpen(!open)}>
                { open ?
                <CloseCircle size={24} color="currentColor" weight="LineDuotone" />
                :
                <SidebarMinimalistic size={20} color="currentColor" />
                }
            </button>
            <div className={`flex flex-col justify-between md:h-full bg-white dark:bg-dark-bg-secondary border-x border-gray-500/[0.1] dark:border-gray-500/[0.2] h-[100vh] md:sticky fixed md:top-0 top-0 py-4 px-4 right-0 overflow-y-auto overflow-x-hidden z-[5] transition-all duration-700 ${open ? "sm:w-[74px] w-[280px] translate-x-[0px] opacity-[1]": "sm:w-full translate-x-[400px] md:translate-x-[0px] md:opacity-[1] opacity-[0]"}`}>  
                <Link to={"/"} className="flex items-center mb-2 sm:p-1">
                    {/* <LogoIcon className="text-primary 2xl:w-[40px] md:w-[32px] w-[24px]" /> */}
                </Link>

                {/* Navigation Links */}
                <div className="flex-1 flex flex-col gap-6 text-sm">
                    <div className="flex flex-col gap-2">
                        <p className={`text-gray-200 text-[12px] mb-2 ${open ? "sm:opacity-0" : ""}`}>MAIN</p>
                        {
                        generalLinks.map(link => {
                                // Render projects with toggleable children
                                if (link.label === 'Projects') {
                                    return (
                                        <div key={link.id} className="flex flex-col gap-1">
                                            <button onClick={() => setprojectsOpen(!projectsOpen)} className={`relative w-full text-left flex items-center justify-between px-3 py-1 h-[32px] md:rounded-[6px] duration-300 ${pathname.includes(link.link) ? "bg-gray-100/[0.2] font-medium" : " hover:bg-gray-100/[0.2]"}`}>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-[24px] opacity-[0.6]">{link.icon}</span>
                                                    <span className={`flex-1 py-1 break-normal duration-500 ${open ? "sm:hidden" : ""}`}>{link.label} </span>
                                                </div>
                                                <span className={`text-xs opacity-60 ${open ? 'sm:hidden' : ''}`}><AltArrowDown className={`duration-300 ${projectsOpen ? "rotate-180" : ""}`} /></span>
                                            </button>

                                            {projectsOpen && (
                                                <div className="flex flex-col pl-8 pr-2 duration-500 gap-1">
                                                    {projectsLinks.map(sublink => (
                                                        <Link key={sublink.id} onClick={() => setOpen(false)} to={sublink.link} className={`relative flex items-center justify-between px-3 py-1 h-[30px] md:rounded-[6px] duration-300 text-sm ${pathname.includes(sublink.link) ? "bg-gray-100/[0.2] font-medium" : " hover:bg-gray-100/[0.2]"}`}>
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-[18px] opacity-[0.6]">{sublink.icon}</span>
                                                                <span className={`flex-1 py-1 break-normal duration-500 ${open ? "sm:hidden" : ""}`}>{sublink.label}</span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                return (
                                <Link key={link.id} onClick={() => setOpen(false)} to={ link.link} className={`relative flex items-center justify-between px-3 py-1 h-[32px] md:rounded-[6px] duration-300 ${pathname.includes(link.link) ? "bg-gray-100/[0.2] font-medium" : " hover:bg-gray-100/[0.2]"}`}>
                                    <div className="flex items-center gap-1">
                                        <span className="w-[24px] opacity-[0.6]">{link.icon}</span>
                                        <span className={`flex-1 py-1 break-normal duration-500 ${open ? "sm:hidden" : ""}`}>{link.label} </span>
                                    </div>
                                    { link.subtext ? <span className="flex items-center justify-center bg-primary text-white text-[9px] rounded-full px-[6px]">{link.subtext}</span> : ""}
                                </Link>
                                )
                        })
                        }
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <p className={`text-gray-200 text-[12px] mb-2 ${open ? "sm:opacity-0" : ""}`}>OTHERS</p>
                        {
                        otherLinks.map(link => {
                                // For Logout, render a button that triggers the auth logout flow
                                if (link.label === 'Logout') {
                                    return (
                                        <button
                                            key={link.id}
                                            onClick={async () => { setOpen(false); await logOut(); navigate('/auth/waitlist'); }}
                                            className={`relative w-full text-left flex items-center justify-between px-3 py-1 h-[32px] md:rounded-[6px] duration-300 cursor-pointer ${pathname.includes(link.link) ? "bg-gray-100/[0.2] font-medium" : " hover:bg-gray-100/[0.2]"}`}>
                                            <div className="flex items-center gap-1">
                                                <span className="w-[24px] opacity-[0.6]">{link.icon}</span>
                                                <span className={`flex-1 py-1 break-normal duration-500 ${open ? "sm:hidden" : ""}`}>{link.label} </span>
                                            </div>
                                        </button>
                                    )
                                }

                                return (
                                <Link key={link.id} onClick={() => setOpen(false)} to={ link.link} className={`relative flex items-center justify-between px-3 py-1 h-[32px] md:rounded-[6px] duration-300 ${pathname.includes(link.link) ? "bg-gray-100/[0.2] font-medium" : " hover:bg-gray-100/[0.2]"}`}>
                                    <div className="flex items-center gap-1">
                                        <span className="w-[24px] opacity-[0.6]">{link.icon}</span>
                                        <span className={`flex-1 py-1 break-normal duration-500 ${open ? "sm:hidden" : ""}`}>{link.label} </span>
                                    </div>
                                    { link.subtext ? <span className="flex items-center justify-center bg-primary text-white text-[9px] rounded-full px-[6px]">{link.subtext}</span> : ""}
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
                        <div className={`flex items-center gap-3 p-1`}>
                            {/* User Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-fuchsia-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {getUserInitial()}
                            </div>
                            
                            {/* User Details */}
                            <div className={`flex-1 min-w-0 ${open ? "sm:hidden" : ""}`}>
                                <p className="font-medium text-sm mb-1">
                                    <span className="text-sm capitalize">{user?.firstname || user?.email?.split('@')[0]}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
