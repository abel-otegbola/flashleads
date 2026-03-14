import { useEffect } from "react"
import LineCircleIcon from "../../../assets/icons/lineCircle"
import Button from "../../../components/button/Button"
import Topbar from "../../../components/topbar/topbar"
import Footer from "../../../components/footer/Footer"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { FREELANCING_SPECIALTIES, SPECIALTY_CATEGORIES } from "../../../constants/specialties"
import { ArrowRight } from "@solar-icons/react"

function Homepage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out'
    })
  }, [])

  return (
    <div className="overflow-hidden">
            
        <Topbar />

        <header className="flex flex-col items-center justify-between min-h-[500px] gap-8 lg:gap-12 lg:px-[8%] md:px-9 px-4 py-12 md:py-12">
            <div className="flex flex-col items-center text-center gap-4 md:max-w-3xl max-w-lg md:p-6" data-aos="fade-up">
                <div className="flex items-center md:text-xs text-[10px] p-1 pr-4 sm:pr-3 rounded-full border border-gray/[0.2] w-fit gap-2 text-xs sm:text-sm shadow mb-2">
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-black text-white font-medium">Hire</span>
                    <span className="font-medium">Start connecting with potential clients</span>
                </div>
                <h1 className="font-bold max-[400px]:text-2xl max-[500px]:text-3xl text-4xl sm:text-4xl lg:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-[64px] md:px-0 sm:px-4 px-4">
                    Find Clients Who  <br/>Already Need Your Skills
                </h1>
                <p className="opacity-[0.8] md:w-[75%] w-[90%] md:mb-8 mb-4 max-w-xl leading-[28px]">
                    Flashleads helps you discover businesses that need your expertise and connect you directly with potential clients.
                </p>
                <div className="flex items-center gap-4">
                    <Button href="/signup">Get Started</Button>
                    <Button variant="secondary">Discover Businesses</Button>
                </div>
            </div>
            <div className="w-full flex items-center justify-center md:mt-[-32px] lg:-mt-16" data-aos="fade-up" data-aos-delay="200">
                <img 
                    src="/hero-bg.png" 
                    alt="FlashLeads Illustration" 
                    className="w-full lg:max-w-5xl h-auto object-contain"
                />
            </div>
        </header>

        <section className="flex flex-col gap-4 py-8 md:px-[8%] px-4">
            <h2 className="text-[14px] uppercase font-semibold text-center">Personalized categories</h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {
                SPECIALTY_CATEGORIES.slice(0, 6).map(category => (
                    <div key={category} className={`rounded-[20px] p-4 bg-cover bg-center text-white flex flex-col justify-between h-[200px]`} style={{ backgroundImage: `url('/categories/${category}.png')` }} data-aos="fade-up">
                        <h3 className="flex gap-2 items-center font-light"># {category} <ArrowRight /></h3>
                        <p className="flex flex-wrap w-full gap-1">{FREELANCING_SPECIALTIES.filter(item => item.category === category).slice(0,4).map(industry => (
                            <span key={industry.label} className="text-[12px] px-3 py-1 rounded-full border border-gray-200/[0.3]">{industry.label}</span>
                        )) }</p>
                    </div>
                ))
            }
            </div>
        </section>

        <section className="flex justify-center flex-col items-center gap-6 py-8 md:px-[8%] px-4 mt-[40px]">
            <div className="flex flex-col items-center justify-center gap-5 md:w-1/2 text-center">
                <div className="max-w-[338px] flex items-center gap-4 w-full">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="text-gray/ rounded font-medium border border-gray/[0.2] md:p-4 md:py-2 p-2 leading-[12px] py-1 text-nowrap md:text-[12px] text-[10px]">Why Flashleads</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl sm:text-2xl text-lg font-semibold">A smarter way for freelancers <br /> to find clients</h1>
                <p>Flashleads helps you discover businesses that may need your skills and reach out with smart, personalized messages.</p>
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 md:gap-8 mt-12 md:px-0">
                <div className="flex flex-col gap-4 p-3" data-aos="fade-up" data-aos-delay="100">
                    <img src="/lead-gen.png" alt="Client Opportunity Discovery Icon" className="w-full h-auto"/>
                    <h1 className="text-4xl opacity-[0.1] font-bold">01</h1>
                    <h2 className="font-semibold text-lg">Discover Client Opportunities</h2>
                    <p className="text-sm opacity-[0.6]">Find businesses that may need your service. Flashleads surfaces opportunities so you don't have to search endlessly for freelance jobs.</p>
                </div>
                <div className="flex flex-col gap-4 p-3" data-aos="fade-up" data-aos-delay="200">
                    <img src="/outreach.png" alt="Smart Outreach Icon" className="w-full h-auto"/>
                    <h1 className="text-4xl opacity-[0.1] font-bold">02</h1>
                    <h2 className="font-semibold text-lg">Smart Outreach Messages</h2>
                    <p className="text-sm opacity-[0.6]">Generate personalized outreach messages designed to help freelancers get replies and start conversations with potential clients.</p>
                </div>
                <div className="flex flex-col gap-4 p-3" data-aos="fade-up" data-aos-delay="300">
                    <img src="/crm.png" alt="Conversation Tracking Icon" className="w-full h-auto"/>
                    <h1 className="text-4xl opacity-[0.1] font-bold">03</h1>
                    <h2 className="font-semibold text-lg">Track Conversations</h2>
                    <p className="text-sm opacity-[0.6]">Keep track of your outreach, replies, and client conversations in one place so you never miss a potential project.</p>
                </div>
            </div>
        </section>

        <section className="flex justify-center flex-col items-center gap-6 py-8 md:px-[8%] px-4 mt-[40px]">
            <div className="flex flex-col items-center justify-center gap-5 md:w-1/2 text-center" data-aos="fade-up">
                <div className="max-w-[338px] flex items-center gap-4 w-full">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="text-gray/ rounded font-medium border border-gray/[0.2] md:p-4 md:py-2 p-2 leading-[12px] py-1 text-nowrap md:text-[12px] text-[10px]">Features</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl sm:text-2xl text-lg font-semibold">Features Built for Freelancers</h1>
                <p>Flashleads helps freelancers discover opportunities, connect with businesses, and grow their client base faster.</p>
            </div>

            <div className="flex gap-6 md:flex-row flex-col">
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray/[0.2] bg-[#D9D9D9]/[0.1]" data-aos="fade-right" data-aos-delay="100">
                        <img src="/features-lead-gen.png" alt="Client Discovery Feature Icon" className="w-full h-auto object-contain"/>
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-lg">Find Businesses That Need Your Skills</h2>
                            <p className="text-sm opacity-[0.6]">Discover potential clients across different industries who may benefit from your expertise.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray/[0.2] bg-[#D9D9D9]/[0.1]" data-aos="fade-right" data-aos-delay="200">
                        <img src="/features-outreach.png" alt="AI Outreach Feature Icon" className="w-full h-auto object-contain"/>
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-lg">AI-Generated Outreach Messages</h2>
                            <p className="text-sm opacity-[0.6]">Create personalized messages that help you introduce your services and increase the chances of getting client replies.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-6 mt-6 md:mt-0">
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray/[0.2] bg-[#D9D9D9]/[0.1]" data-aos="fade-left" data-aos-delay="100">
                        <img src="/features-crm.png" alt="Conversation Tracking Feature Icon" className="w-full h-auto object-contain"/>
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-lg">Track Outreach and Replies</h2>
                            <p className="text-sm opacity-[0.6]">Manage your conversations, follow up with leads, and keep track of potential projects in one simple dashboard.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray/[0.2] bg-[#D9D9D9]/[0.1]" data-aos="fade-left" data-aos-delay="200">
                        <img src="/features-social.png" alt="Opportunity Insights Icon" className="w-full h-auto object-contain"/>
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-lg">Understand Each Lead Better</h2>
                            <p className="text-sm opacity-[0.6]">Get helpful information about potential clients so you can personalize your outreach and offer the right solution.</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>

        <section className="bg-gray/[0.05] flex justify-center flex-col items-center gap-6 md:mx-[8%] mx-4 p-[5%] mt-[40px] rounded-lg mb-16" data-aos="zoom-in">
            <h1 className="xl:text-4xl text-2xl font-semibold text-center">Start Finding Clients Today</h1>
            <p className="text-center max-w-2xl">Join freelancers using Flashleads to discover opportunities, connect with potential clients, and grow their freelance business.</p>
            <Button href="/signup" className="text-[14px]">Get Started</Button>
        </section>

        <Footer />

    </div>

  )
}

export default Homepage