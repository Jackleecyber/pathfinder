import Button from '@/components/Button';
import Card from '@/components/Card';
import Image from 'next/image';

export default function Pricing() {
  const plans = [
    {
      name: "CV & Resume Optimization",
      price: "$299",
      description: "One-time comprehensive CV/resume review and optimization",
      features: [
        "Line-by-line resume review and feedback",
        "2 rounds of revisions",
        "ATS optimization",
        "Industry-specific formatting",
        "Cover letter review (if needed)",
        "LinkedIn profile review",
        "Email support for 30 days"
      ],
      bestFor: "Students who need resume help before starting applications"
    },
    {
      name: "Interview Preparation Package",
      price: "$599",
      description: "Comprehensive interview prep with mock interviews",
      features: [
        "3 mock interview sessions (behavioral or technical)",
        "Industry-specific question banks",
        "Video-recorded sessions with detailed feedback",
        "Interview strategy sessions",
        "Pre-interview briefing calls",
        "Email support throughout your interview process"
      ],
      bestFor: "Students with interviews coming up who need to build confidence"
    },
    {
      name: "Career Launch (3-Month)",
      price: "$1,499",
      description: "Complete mentorship package for your job search",
      features: [
        "CV/resume optimization",
        "Career strategy sessions",
        "6 mentorship sessions (1-on-1)",
        "Mock interview sessions",
        "Application review before submission",
        "Networking strategy and templates",
        "Ongoing email support",
        "Offer negotiation guidance"
      ],
      bestFor: "Students starting their job search who want comprehensive support"
    },
    {
      name: "Career Launch (6-Month)",
      price: "$2,499",
      description: "Extended mentorship for sustained career growth",
      features: [
        "Everything in 3-Month package",
        "12 mentorship sessions (1-on-1)",
        "Priority document review",
        "Long-term career development",
        "Career transition support",
        "Extended email support",
        "Access to mentor network"
      ],
      bestFor: "Students who want ongoing mentorship and long-term career guidance",
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Transparent Pricing
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                No hidden fees, no misleading packages. Choose the support level that fits your needs as a Malaysian student targeting opportunities in London, Malaysia, and Singapore. Start with a free strategy call to discuss what's right for you.
              </p>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                alt="Pricing and packages"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'ring-2 ring-blue-600 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.name.includes('Month') && (
                      <span className="text-gray-600 ml-2">/total</span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-4">Best for:</p>
                  <p className="text-sm text-gray-600 mb-6">{plan.bestFor}</p>
                  
                  <p className="text-sm font-semibold text-gray-900 mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="text-blue-600 mr-2 mt-1">✓</span>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  href="#contact" 
                  variant={plan.popular ? "primary" : "outline"} 
                  className="w-full"
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              How to Get Started
            </h2>
            <p className="text-lg text-gray-600">
              Simple, transparent process—no pressure
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                  1
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Book a Free Strategy Call</h3>
                <p className="text-gray-600">
                  Schedule a 30-minute call to discuss your goals, challenges, and what kind of support you need. No obligation, no pressure—just honest conversation.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                  2
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Package</h3>
                <p className="text-gray-600">
                  Based on our conversation, we'll recommend the package that best fits your needs. You choose what works for you—we won't upsell or pressure you.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                  3
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Matched with Your Mentor</h3>
                <p className="text-gray-600">
                  We'll match you with a mentor who understands your industry and goals. You'll have an introduction call and start your mentorship journey.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                  4
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Journey</h3>
                <p className="text-gray-600">
                  Begin working with your mentor on your CV, interview prep, or career strategy. Get the support you need, when you need it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Do you guarantee I'll get an offer?
              </h3>
              <p className="text-gray-600">
                We can't guarantee offers because outcomes depend on many factors including market conditions, your background, effort, and interview performance. What we can guarantee is that you'll feel more prepared, confident, and have better materials. Most students see significant improvements in response rates and interview confidence.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What if I'm not happy with my mentor?
              </h3>
              <p className="text-gray-600">
                We want you to have a great experience. If you're not connecting with your mentor or feel they're not the right fit, we'll work with you to find a better match. Our goal is your success, and that starts with having the right mentor.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I change my package later?
              </h3>
              <p className="text-gray-600">
                Yes. If you start with a smaller package and want to upgrade to ongoing mentorship, you can. We'll prorate the difference. We're flexible because your needs may change as you progress through your job search.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                How quickly can I get started?
              </h3>
              <p className="text-gray-600">
                Most students can schedule their strategy call within a few days. After the call and package selection, we typically match you with a mentor within a week. For urgent needs (like an interview next week), we can expedite the process.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Do you offer payment plans?
              </h3>
              <p className="text-gray-600">
                For the 3-Month and 6-Month packages, we offer payment plans. We can split the payment into 2-3 installments. Contact us after your strategy call to discuss payment options.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What industries and locations do you cover?
              </h3>
              <p className="text-gray-600">
                We work with Malaysian students targeting opportunities in <strong>London, Malaysia, and Singapore</strong>. We cover finance (investment banking, private equity, asset management), consulting (McKinsey, BCG, Deloitte, etc.), tech (software engineering, product management, data science), and business roles (analytics, strategy, operations). Our mentors have experience in all three markets and understand cross-border recruiting, visa processes, and regional market differences. If you're targeting a different field or location, let's discuss in your strategy call—we may still be able to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700" id="contact">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a free strategy call to discuss your goals and see if we're a good fit. No commitment, no pressure—just honest conversation.
          </p>
          <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Your Free Strategy Call</h3>
            <p className="text-gray-600 mb-6">
              Schedule a 30-minute call to discuss your career goals and how we can help.
            </p>
            <Button 
              href="mailto:hello@pathfinder.mentor?subject=Strategy Call Request" 
              variant="primary" 
              className="w-full"
            >
              Schedule a Call
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Or email us at <a href="mailto:hello@pathfinder.mentor" className="text-blue-600 hover:underline">hello@pathfinder.mentor</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

