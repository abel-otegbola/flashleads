import LineCircleIcon from "../../../assets/icons/lineCircle"
import Button from "../../../components/button/Button"
import Topbar from "../../../components/topbar/topbar"
import Footer from "../../../components/footer/Footer"

function Homepage() {
  return (
    <div className="overflow-hidden">
            
        <Topbar />

        <header className="flex flex-col items-center justify-between min-h-[500px] gap-8 lg:gap-12 lg:px-16 md:px-9 px-4 py-12 md:py-12">
            <div className="flex flex-col items-center text-center gap-4 md:max-w-3xl max-w-lg md:p-6">
                <div className="flex items-center p-1 pr-4 sm:pr-6 rounded-full border border-gray-500/[0.2] w-fit gap-2 text-xs sm:text-sm shadow">
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-black text-white font-medium text-xs">Hire</span>
                    <span className="font-medium text-xs">Start connecting with potential clients</span>
                </div>
                <h1 className="font-bold max-[500px]:text-3xl text-4xl sm:text-4xl lg:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-[64px] md:px-0 sm:px-4 px-4">
                    Find Clients Who  <br/>Already Need Your Skills
                </h1>
                <p className="opacity-[0.8] md:w-[75%] w-[90%] md:mb-8 mb-4 max-w-xl leading-[28px]">
                    Prospo helps you discover businesses that need your expertise and connect you directly with potential clients.
                </p>
                <div className="flex items-center gap-4">
                    <Button href="/signup">Get Started</Button>
                    <Button variant="secondary">Discover Businesses</Button>
                </div>
            </div>
            <div className="w-full flex items-center justify-center md:mt-[-32px] lg:-mt-16">
                <img 
                    src="/hero-bg.png" 
                    alt="FlashLeads Illustration" 
                    className="w-full lg:max-w-5xl h-auto object-contain"
                />
            </div>
        </header>

        <section className="flex justify-center flex-col items-center gap-6 py-8 md:px-[5%] px-4">
            <div className="flex flex-col items-center justify-center gap-5 md:w-1/2 text-center">
                <div className="max-w-[338px] flex items-center gap-4 w-full">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="text-gray-400 rounded font-medium border border-gray-100 md:p-4 md:py-2 p-2 leading-[12px] py-1 text-nowrap md:text-[12px] text-[10px]">Why Choose Us</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl text-2xl font-semibold">Join freelancers who want a smarter way to find clients</h1>
                <p>Instead of waiting for clients to post jobs, Prospo helps you discover opportunities and reach out first</p>
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
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray-200/[0.2] bg-[#D9D9D9]/[0.1]">
                        <img src="/features-lead-gen.png" alt="Feature 1 Icon" className="w-full h-auto object-contain"/>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-primary uppercase">Instant leads</h1>
                            <h2 className="font-semibold text-lg">AI-Powered Lead Discovery</h2>
                            <p className="text-sm text-gray-600">Discover targeted leads across industries, locations, and company sizes — complete with decision-maker details and enriched contact data.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray-200/[0.2] bg-[#D9D9D9]/[0.1]">
                        <img src="/features-outreach.png" alt="Feature 2 Icon" className="w-full h-auto object-contain"/>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-primary uppercase">Easy Outreach</h1>
                            <h2 className="font-semibold text-lg">Personalized Email Campaigns</h2>
                            <p className="text-sm text-gray-600">Launch optimized cold email sequences that improve deliverability, engagement, and reply rates. Connect Gmail or Outlook in seconds.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-6 mt-6 md:mt-0">
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray-200/[0.2] bg-[#D9D9D9]/[0.1]">
                        <img src="/features-crm.png" alt="Feature 3 Icon" className="w-full h-auto object-contain"/>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-primary uppercase">Build Relationships</h1>
                            <h2 className="font-semibold text-lg">Integrated CRM</h2>
                            <p className="text-sm text-gray-600">A lightweight CRM that keeps your leads, clients, and communication history structured and easy to manage.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray-200/[0.2] bg-[#D9D9D9]/[0.1]">
                        <img src="/features-social.png" alt="Feature 4 Icon" className="w-full h-auto object-contain"/>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-primary uppercase">Social Connect</h1>
                            <h2 className="font-semibold text-lg">Social & Web Profile Enrichment</h2>
                            <p className="text-sm text-gray-600">Instant access to LinkedIn, Twitter, Facebook, website info, and key company insights — all in one view.</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>

        <section className="bg-black text-white flex justify-center flex-col md:items-center gap-6 md:mx-[5%] mx-4 p-[5%] rounded-lg mb-16">
            <h1 className="xl:text-4xl text-2xl font-semibold md:text-center">Ready to Supercharge Your Sales?</h1>
            <p className="md:text-center max-w-2xl">Join thousands of freelancers, agencies, and businesses using FlashLeads to discover leads, automate outreach, and close deals faster.</p>
            <Button href="/signup" className="text-[14px]">Start Your Free Trial Today</Button>
        </section>

        <Footer />

    </div>

  )
}

export default Homepage