import LineCircleIcon from "../../../assets/icons/lineCircle"
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
                <h1 className="md:flex hidden flex-col gap-2 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-[0.5] md:mb-4">
                    Turn Customer 
                    <span className="flex md:mt-2 gap-4 items-center">Data into <img 
                        src="/hero-img2.png" 
                        alt="FlashLeads Illustration" 
                        className="object-contain md:block hidden"/></span>
                </h1>
                <h1 className="text-3xl font-bold">Turn Customer Data into</h1>
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

        <section className="flex justify-center flex-col md:items-center gap-6 py-8 md:px-[5%] px-4">
            <div className="flex flex-col md:items-center justify-center gap-5 md:w-1/2 md:text-center">
                <div className="max-w-[338px] flex items-center gap-4 w-full">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="text-gray-400 rounded font-medium border border-gray-100 md:p-4 md:py-2 p-2 leading-[12px] py-1 text-nowrap md:text-[12px] text-[10px]">Why Choose Us</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl text-2xl font-semibold">Complete Lead Generation & Outreach Platform Built for Growth</h1>
                <p>FlashLeads combines advanced lead discovery, real-time contact enrichment, and intelligent outreach automation, enabling you to identify new opportunities and convert them faster.</p>
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 md:gap-8 mt-12 md:px-0">
                <div className="flex flex-col gap-4 p-3 border border-gray-200/[0.2] rounded-lg">
                    <img src="/lead-gen.png" alt="Lead Generation Icon" className="w-full h-auto"/>
                    <h1 className="text-xl text-primary font-bold">01</h1>
                    <h2 className="font-semibold text-lg">Advanced Lead Generation</h2>
                    <p className="text-sm text-gray-600">Discover high-quality leads with our AI-powered search and filtering tools, tailored to your ideal customer profile.</p>
                </div>
                <div className="flex flex-col gap-4 p-3 border border-gray-200/[0.2] rounded-lg">
                    <img src="/outreach.png" alt="Outreach Automation Icon" className="w-full h-auto"/>
                    <h1 className="text-xl text-primary font-bold">02</h1>
                    <h2 className="font-semibold text-lg">Automated Outreach</h2>
                    <p className="text-sm text-gray-600">Create personalized email campaigns and follow-ups that nurture leads and drive conversions, all on autopilot.</p>
                </div>
                <div className="flex flex-col gap-4 p-3 border border-gray-200/[0.2] rounded-lg">
                    <img src="/crm.png" alt="CRM Icon" className="w-full h-auto"/>
                    <h1 className="text-xl text-primary font-bold">03</h1>
                    <h2 className="font-semibold text-lg">Integrated CRM</h2>
                    <p className="text-sm text-gray-600">Manage your leads, track interactions, and monitor sales pipelines with our built-in CRM designed for efficiency.</p>
                </div>
            </div>
        </section>

        <section className="flex justify-center flex-col md:items-center gap-6 py-8 md:px-[5%] px-4">
            <div className="flex flex-col md:items-center justify-center gap-5 md:w-1/2 md:text-center">
                <div className="max-w-[338px] flex items-center gap-4 w-full">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="text-gray-400 rounded font-medium border border-gray-100 md:p-4 md:py-2 p-2 leading-[12px] py-1 text-nowrap md:text-[12px] text-[10px]">Features</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl text-2xl font-semibold">Features That Drive Success</h1>
                <p>Whether you're targeting local businesses or international clients, FlashLeads delivers verified, up-to-date contact data across global markets.</p>
            </div>

            <div className="flex gap-4 md:flex-row flex-col">
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    <div className="flex gap-4 flex-col p-10 rounded-lg border border-gray-200/[0.2] bg-[#D9D9D9]/[0.1]">
                        <img src="/features-lead-gen.png" alt="Feature 1 Icon" className="w-full h-auto object-contain"/>
                        <div>
                            <h2 className="font-semibold text-lg">AI-Powered Lead Discovery</h2>
                            <p className="text-sm text-gray-600">Utilize advanced AI algorithms to identify and target high-potential leads that match your ideal customer profile.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col p-10 rounded-lg border border-gray-200/[0.2] bg-[#D9D9D9]/[0.1]">
                        <img src="/features-outreach.png" alt="Feature 2 Icon" className="w-full h-auto object-contain"/>
                        <div>
                            <h2 className="font-semibold text-lg">Personalized Email Campaigns</h2>
                            <p className="text-sm text-gray-600">Craft tailored email sequences that engage your audience and increase response rates through automation.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-6 mt-6 md:mt-0">
                    <div className="flex gap-4 flex-col p-10 rounded-lg border border-gray-200/[0.2] bg-[#D9D9D9]/[0.1]">
                        <img src="/features-crm.png" alt="Feature 3 Icon" className="w-full h-auto object-contain"/>
                        <div>
                            <h2 className="font-semibold text-lg">Integrated CRM</h2>
                            <p className="text-sm text-gray-600">Manage your leads, track interactions, and monitor sales pipelines with our built-in CRM designed for efficiency.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col p-10 rounded-lg border border-gray-200/[0.2] bg-[#D9D9D9]/[0.1]">
                        <img src="/features-social.png" alt="Feature 4 Icon" className="w-full h-auto object-contain"/>
                        <div>
                            <h2 className="font-semibold text-lg">Real-Time Analytics</h2>
                            <p className="text-sm text-gray-600">Gain insights into your outreach performance with detailed analytics and reporting tools to optimize your strategies.</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>

    </div>

  )
}

export default Homepage