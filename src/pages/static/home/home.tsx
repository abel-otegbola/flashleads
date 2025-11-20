import Button from "../../../components/button/Button"
import Topbar from "../../../components/topbar/topbar"

function Homepage() {
  return (
    <div className="overflow-hidden">
            
        <Topbar />

        <header className="flex flex-col md:flex-row justify-between min-h-screen gap-8 lg:gap-12 lg:px-16 md:px-9 px-4 py-12 md:py-12">
            <div className="w-full md:w-1/2 flex flex-col items-start max-w-2xl md:py-12">
                <div className="flex items-center p-1 pr-4 sm:pr-6 rounded-full border border-gray-500/[0.2] w-fit md:mb-10 mb-4 gap-2 text-xs sm:text-sm">
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-primary text-white font-medium text-xs">New</span>
                    <span className="font-medium text-xs">Perfectly Organized with New AI Tools</span>
                </div>
                <h1 className="flex md:flex-col gap-2 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-[0.5] md:mb-4">
                    Turn Customer 
                    <span className="flex md:mt-2 gap-4 items-center">Data into <img 
                        src="/hero-img2.png" 
                        alt="FlashLeads Illustration" 
                        className="object-contain md:block hidden"/></span>
                </h1>
                <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-[0.5] text-[#21E061] mb-2 md:mb-12">
                    Sales Success
                </h1>
                <p className="opacity-[0.8] md:w-[75%] md:mb-8 mb-4 max-w-xl leading-[28px]">
                    FlashLeads helps freelancers, agencies, and growing businesses discover qualified leads, automate outreach, and manage client relationships, all from one powerful, streamlined platform.
                </p>
                <div className="flex items-center gap-4">
                    <Button href="/signup" className="text-[14px]">Start Free Trial</Button>
                    <Button variant="secondary" className="text-[14px]">Learn More</Button>
                </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0">
                <img 
                    src="/hero-img.png" 
                    alt="FlashLeads Illustration" 
                    className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
                />
            </div>
        </header>

    </div>

  )
}

export default Homepage