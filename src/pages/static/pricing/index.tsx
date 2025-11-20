import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for freelancers and solo entrepreneurs",
      features: [
        "Up to 100 leads per month",
        "Basic lead search",
        "Email tracking",
        "5 email templates",
        "Basic analytics",
        "Community support"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Professional",
      price: "$49",
      period: "per month",
      description: "Ideal for small teams and growing businesses",
      features: [
        "Up to 1,000 leads per month",
        "Advanced lead search",
        "Unlimited email tracking",
        "Unlimited email templates",
        "Advanced analytics & reports",
        "CRM integration",
        "Email automation",
        "Priority support",
        "API access"
      ],
      cta: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "For large teams with advanced needs",
      features: [
        "Unlimited leads",
        "Custom lead filters",
        "White-label options",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security",
        "SSO & SAML",
        "SLA guarantee",
        "Training & onboarding",
        "24/7 premium support"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Topbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Choose the Perfect Plan for Your Business
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            <button className="px-6 py-2 rounded-full bg-white dark:bg-gray-700 shadow-sm font-medium text-sm">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-full font-medium text-sm text-gray-600 dark:text-gray-400">
              Yearly <span className="text-green-600 text-xs ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-primary to-fuchsia-500 text-white shadow-2xl scale-105 relative"
                  : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.highlighted ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== "Free" && plan.price !== "Custom" && (
                    <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}>
                      / month
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${plan.highlighted ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}>
                  {plan.period}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-white" : "text-green-500"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${plan.highlighted ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-gray-100 shadow-lg"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-4xl mx-auto pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: "Can I change my plan later?",
              a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the charges."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
            },
            {
              q: "Is there a free trial?",
              a: "Yes! All paid plans come with a 14-day free trial. No credit card required to start."
            },
            {
              q: "What happens when I reach my lead limit?",
              a: "You'll receive a notification when you're approaching your limit. You can upgrade anytime to continue accessing more leads."
            }
          ].map((faq, index) => (
            <div key={index} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Pricing;
