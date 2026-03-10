import { Link } from "react-router-dom";
import Button from "../button/Button";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContextValue";

// Move AuthCTA component outside of Topbar to avoid creating components during render
const AuthCTA = ({ user }: { user: { email?: string } | null }) => {
    if (user) {
        const email = user.email || '';
        const initial = email ? email[0].toUpperCase() : 'U';
        return (
            <Link to={"/account"} className="w-8 h-8 rounded-full bg-slate-300 text-white outline outline-offset-2 outline-gray-200/[0.2] border border-gray-500/[0.2] flex items-center justify-center font-semibold">
                {initial}
            </Link>
        );
    }

    return (
        <>
        <Button href="/login" variant="secondary" className="md:w-fit w-full">Login</Button>
        <Button href="/signup" className="md:w-fit w-full">Sign up</Button>
        </>
    );
}

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
        <div className={`flex justify-between items-center w-full lg:px-16 md:px-9 p-4 md:py-6 z-[999] sticky top-0 backdrop-blur-md transition-shadow duration-300`}>
            <Link to={"/"} className="flex gap-2 items-center">
                <h3 className="md:text-[20px] text-[16px] font-bold uppercase">Prospo</h3>
            </Link>
            
            <ul className={`
                flex md:flex-row flex-col md:items-center md:gap-2 lg:gap-4
                md:static fixed top-0 right-0 md:z-auto z-[999]
                md:w-auto w-[280px] sm:w-[320px]
                md:h-auto h-screen
                md:bg-transparent bg-white dark:bg-dark
                md:shadow-none shadow-xl
                md:p-0 pt-20 px-6 pb-6
                md:translate-x-0 ${open ? "translate-x-0" : "translate-x-full"}
                transition-transform duration-300 ease-in-out
            `}>
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
                                className={`font-semibold lg:px-4 md:px-2 py-2 duration-200 block w-full rounded-md
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
                    <div onClick={() => setOpen(false)} className="flex md:gap-4 gap-6 md:flex-row flex-col">
                        <AuthCTA user={user} />
                    </div>
                </li>
            </ul>
            
            {/* Right actions - Desktop only */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
                <AuthCTA user={user} />
            </div>
            
            {/* Hamburger menu button */}
            <button 
                className="md:hidden flex flex-col justify-center items-center gap-1 w-10 h-10 z-[1000] relative" 
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
            >
                <span className={`w-5 h-0.5 bg-back dark:bg-gray-400 rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-1.5" : ""}`}></span>
                <span className={`w-5 h-0.5 bg-back dark:bg-gray-400 rounded-full transition-all duration-300 ${open ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}></span>
                <span className={`w-5 h-0.5 bg-back dark:bg-gray-400 rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
            </button>
        </div>
        </>
    )
}

export default Topbar
