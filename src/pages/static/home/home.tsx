import Topbar from "../../../components/topbar/topbar"

function Homepage() {
  return (
    <div>
            
        <Topbar />

        <header className="flex flex-col md:flex-row items-center justify-between min-h-screen gap-8 lg:gap-12 lg:px-16 md:px-9 px-4 py-12 md:py-20">
            <div className="w-full md:w-1/2 flex flex-col items-start max-w-2xl">
                <div className="flex items-center p-1 pr-4 sm:pr-6 rounded-full border border-gray-500/[0.2] w-fit mb-6 gap-2 text-xs sm:text-sm">
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-primary text-white font-medium text-xs">New</span>
                    <span className="">Perfectly Organized with New AI Tools</span>
                </div>
                <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight sm:leading-tight md:leading-tight lg:leading-[1.1] mb-4">
                    Turn Customer Data into
                </h1>
                <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight sm:leading-tight md:leading-tight lg:leading-[1.1] bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent mb-6 md:mb-8">
                    Sales Success
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                    Discover high-quality leads and streamline your cold email campaigns with FlashLeads. Sign up today and take your business to the next level!
                </p>
                <a 
                    href="/signup" 
                    className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                >
                    Get Started for Free
                </a>
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