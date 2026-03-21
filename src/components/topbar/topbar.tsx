import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContextValue";
import { AuthCTA } from "../authCTA/AuthCTA";
import SearchBar from "../search/searchBar";
import LogoIcon from "../../assets/icons/logo";

function Topbar() {
    const [open, setOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("")
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {

            // Detect active section
            const sections = ["Hire Freelancers", "Find Opportunities", "Pricing", "Contact Us"]
            const scrollPosition = window.scrollY + 100

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(`#${sectionId}`)
                        break
                    }
                }
            }

            // Clear active section if at the top
            if (window.scrollY < 100) {
                setActiveSection("")
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
        <div className={`flex justify-between items-center w-full lg:px-[3%] md:px-9 p-4 md:py-6 z-[999] sticky top-0 backdrop-blur-md transition-shadow duration-300`}>
            <div className="flex items-center gap-6">
            <Link to={"/"} className="flex gap-2 items-center">
            <div className="relative">
                <LogoIcon width={28} height={28} className="rounded-full z-[2]" />
            </div>
            <h3 className="font-medium text-[16px] tracking-[2px]">Flashleads</h3>
            </Link>
            
            <ul className={`
                flex md:flex-row flex-col md:items-center md:gap-2 lg:gap-4
                md:static fixed top-0 right-0 md:z-auto z-[999]
                md:w-auto w-full sm:w-[320px]
                md:h-auto h-screen
                md:bg-transparent bg-background dark:bg-dark
                md:shadow-none shadow-xl
                md:p-0 py-3 px-6 pb-6
                md:translate-x-0 ${open ? "translate-x-0" : "translate-x-full"}
                transition-transform duration-500 ease-in-out
            `}>
                <LogoIcon width={28} height={28} className="md:hidden my-4" />
                {
                    [
                        { id: 0, title: "Hire Freelancers", href: "#freelancers" },
                        { id: 1, title: "Find Opportunities", href: "#opportunities" },
                        { id: 2, title: "Pricing", href: "#pricing" },
                        { id: 3, title: "Contact Us", href: "#contact" },
                    ].map(link => (
                        <li key={link.id} className="md:px-0 md:py-0 py-2">
                            <a 
                                href={link.href} 
                                className={`font-semibold lg:px-3 md:px-2 py-2 duration-200 block w-full rounded-md
                                    ${activeSection === link.href 
                                        ? 'text-primary' 
                                        : ''
                                    } 
                                    hover:text-primary
                                `}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.querySelector(link.href);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                        setOpen(false);
                                    }
                                }}
                            >
                                {link.title}
                            </a>
                        </li>
                    ))
                }
                {/* Mobile CTA */}
                <li className="md:hidden mt-4">
                    <div onClick={() => setOpen(false)} className="flex md:flex-row flex-col md:gap-2 gap-4 items-center">
                        <AuthCTA user={user} />
                        {
                            user && 
                            <div className="leading-[100%] flex flex-col gap-2">
                                <p className="font-semibold">Account</p>
                                <p className="text-[12px]">{user?.email}</p>
                            </div>
                        }
                    </div>
                </li>
            </ul>
            </div>
            
            {/* Right actions - Desktop only */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
                <SearchBar />
                <AuthCTA user={user} />
            </div>
            
            {/* Hamburger menu button */}
            <button 
                className="md:hidden flex flex-col justify-center items-center gap-1 w-10 h-10 z-[1000] relative" 
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
            >
                <span className={`w-5 h-0.5 bg-text/[0.6] rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-1.5" : ""}`}></span>
                <span className={`w-3 h-0.5 bg-text/[0.6] rounded-full transition-all duration-300 ${open ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}></span>
                <span className={`w-5 h-0.5 bg-text/[0.6] rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
            </button>
        </div>
        </>
    )
}

export default Topbar
