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
            <Link to={"/account"} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">{initial}</Link>
        );
    }

    return (
        <Button variant="secondary"><Link to="/signup">Sign up</Link></Button>
    );
}

function Topbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState("")
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)

            // Detect active section
            const sections = ["features", "how-it-works", "pricing", "testimonials"]
            const scrollPosition = window.scrollY + 100 // Offset for better detection

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
        <div className={`flex justify-between items-center w-full lg:px-16 md:px-9 px-4 py-4 z-[999] sticky top-0 bg-white/95 dark:bg-dark/95 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
            <Link to={"/"} className="flex gap-2 items-center z-[1000]">
                <img src="/logo.png" alt="FlashLeads Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain"/>
                <h3 className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent from-primary to-fuchsia-400">FlashLeads</h3>
            </Link>
            
            {/* Overlay for mobile menu */}
            {open && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[998] md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
            
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
                        { id: 0, title: "Products", href: "#features" },
                        { id: 1, title: "Solutions", href: "#how-it-works" },
                        { id: 2, title: "Pricing", href: "#pricing" },
                        { id: 3, title: "Contact Us", href: "#testimonials" },
                    ].map(link => (
                        <li key={link.id} className="md:px-0 md:py-0 py-2">
                            <a 
                                href={link.href} 
                                className={`font-medium text-sm md:text-base lg:px-4 md:px-2 py-2 duration-200 block w-full rounded-md
                                    ${activeSection === link.href 
                                        ? 'text-primary md:border-b-2 border-primary' 
                                        : 'text-gray-700 dark:text-gray-200'
                                    } 
                                    hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent
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
                <li className="md:hidden mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                        to="/contact" 
                        className="text-primary font-medium block py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                        onClick={() => setOpen(false)}
                    >
                        Message us
                    </Link>
                </li>
                {/* Mobile CTA */}
                <li className="md:hidden mt-4">
                    <div onClick={() => setOpen(false)}>
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
                <span className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-1.5" : ""}`}></span>
                <span className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 ${open ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}></span>
                <span className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
            </button>
        </div>
        </>
    )
}

export default Topbar
