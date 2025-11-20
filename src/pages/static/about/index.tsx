import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";

function About() {
  const team = [
    { name: "Sarah Chen", role: "CEO & Co-Founder", image: "👩‍💼" },
    { name: "Michael Rodriguez", role: "CTO & Co-Founder", image: "👨‍💻" },
    { name: "Emily Watson", role: "Head of Product", image: "👩‍🎨" },
    { name: "David Kim", role: "Head of Engineering", image: "👨‍🔧" },
    { name: "Lisa Anderson", role: "Head of Sales", image: "👩‍💼" },
    { name: "James Thompson", role: "Head of Marketing", image: "👨‍💼" }
  ];

  const values = [
    {
      icon: "🎯",
      title: "Customer First",
      description: "We build products that solve real problems for real people"
    },
    {
      icon: "🚀",
      title: "Innovation",
      description: "We constantly push boundaries to deliver cutting-edge solutions"
    },
    {
      icon: "🤝",
      title: "Transparency",
      description: "We believe in honest communication and clear pricing"
    },
    {
      icon: "💪",
      title: "Excellence",
      description: "We strive for quality in everything we do"
    }
  ];

  const milestones = [
    { year: "2020", event: "FlashLeads founded by Sarah and Michael" },
    { year: "2021", event: "Launched beta version with 100 early adopters" },
    { year: "2022", event: "Reached 10,000 users and $1M ARR" },
    { year: "2023", event: "Series A funding of $5M, expanded to 50 employees" },
    { year: "2024", event: "50,000+ users across 120 countries" },
    { year: "2025", event: "Launched AI-powered lead scoring and automation" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Topbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            We're on a Mission to Transform Sales
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            FlashLeads was born from the frustration of spending countless hours on manual lead generation. We believe sales teams should focus on selling, not searching.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "50K+", label: "Active Users" },
            { number: "120+", label: "Countries" },
            { number: "5M+", label: "Leads Generated" },
            { number: "98%", label: "Customer Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                In 2020, Sarah and Michael were running a digital agency, spending 20+ hours a week on lead generation. They knew there had to be a better way.
              </p>
              <p>
                After months of building and testing, FlashLeads was born. What started as a simple lead database quickly evolved into a comprehensive CRM platform that helps thousands of businesses worldwide.
              </p>
              <p>
                Today, we're a team of 50+ passionate individuals dedicated to making sales easier, faster, and more effective for businesses of all sizes.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-fuchsia-500/20 rounded-2xl h-96 flex items-center justify-center text-6xl">
            🚀
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-4xl mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex-shrink-0 w-24 font-bold text-primary">{milestone.year}</div>
              <div className="flex-1 pb-8 border-l-2 border-gray-200 dark:border-gray-700 pl-6 relative">
                <div className="absolute left-0 top-0 w-4 h-4 bg-primary rounded-full -translate-x-[9px]"></div>
                <p className="text-gray-700 dark:text-gray-300">{milestone.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            We're a diverse team of dreamers, innovators, and problem-solvers united by one goal: helping businesses succeed.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-3">{member.image}</div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto py-20">
        <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Us on This Journey</h2>
          <p className="text-lg mb-8 opacity-90">
            Be part of the future of sales. Start your free trial today.
          </p>
          <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            Get Started Free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
