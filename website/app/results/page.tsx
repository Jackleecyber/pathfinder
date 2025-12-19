import Button from '@/components/Button';
import Card from '@/components/Card';
import Image from 'next/image';

export default function Results() {
  const testimonials = [
    {
      name: "Aisyah M.",
      background: "Finance Major, UM (University of Malaya)",
      result: "Offers: McKinsey Singapore, BCG London, DBS",
      story: "As a Malaysian student, I wasn't sure how to position myself for opportunities in London and Singapore. I had good grades from UM, but I didn't know how international firms viewed Malaysian universities or how to navigate cross-border recruiting.",
      impact: "My mentor, who worked at McKinsey Singapore, helped me understand how to position my Malaysian background as a strength. She showed me how to highlight my cross-cultural experience and adapt my CV for different markets. The mock interviews were tailored to Singapore and London offices, which made a huge difference.",
      outcome: "I got offers from all three locations! I chose McKinsey Singapore because my mentor helped me understand the work culture and growth opportunities. The whole process went from overwhelming to manageable, and I felt confident in my decision."
    },
    {
      name: "Wei Ming T.",
      background: "Computer Science, USM (Universiti Sains Malaysia)",
      result: "Offer: Google Singapore, Product Manager",
      story: "I wanted to work in tech in Singapore, but I wasn't sure how Malaysian tech talent is perceived there. Product manager interviews are completely different from what I was used to, and I felt lost navigating the Singapore tech market.",
      impact: "My mentor was a former PM at Google Singapore who understood the regional market. The mock interviews were game-changing—he gave me insights into how Singapore tech companies view Malaysian talent (very positively!) and what they actually look for. It wasn't about memorizing answers—it was about understanding the regional context.",
      outcome: "I felt so much more confident going into real interviews. When I got the offer from Google Singapore, my mentor even helped me understand the visa process and salary expectations. I'm now in Singapore, and I love it!"
    },
    {
      name: "Priya K.",
      background: "Business Analytics, UTM (Universiti Teknologi Malaysia)",
      result: "Offers: JPMorgan London, Maybank KL",
      story: "I thought my CV was fine until I got feedback from mentors in both London and KL. I was using a generic template and didn't realize how different the expectations are between international and local firms. I wasn't sure which path was right for me.",
      impact: "My mentors helped me understand both markets. The London mentor showed me how to position myself for international banking, while the KL mentor helped me understand the local market. I learned to tailor my CV for each market—highlighting different aspects of my experience. My response rate went from maybe 5% to over 30%.",
      outcome: "I got offers from both JPMorgan London and Maybank KL. My mentors helped me evaluate both options—considering salary, growth opportunities, and lifestyle. I chose JPMorgan London, but having both options gave me confidence in my decision."
    },
    {
      name: "Hafiz R.",
      background: "Economics, UKM (Universiti Kebangsaan Malaysia)",
      result: "Offers: Goldman Sachs London, CIMB KL",
      story: "The career strategy sessions helped me figure out what I actually wanted. I was applying everywhere—London, Singapore, Malaysia—without understanding the differences. That made the whole process overwhelming and ineffective.",
      impact: "My mentor, who worked at both Goldman London and now at a Malaysian bank, helped me understand my options across all three markets. We discussed visa requirements, salary expectations, cultural differences, and long-term career paths. The interview prep was rigorous, but I felt supported throughout.",
      outcome: "I got offers from both Goldman London and CIMB KL. My mentor helped me evaluate both offers and understand the trade-offs. I chose Goldman London, but I'm grateful I had options in Malaysia too. The mentorship helped me make an informed decision."
    },
    {
      name: "Siti N.",
      background: "Engineering, UTM",
      result: "Offer: Amazon Singapore, Software Engineer",
      story: "I wanted to work in tech in Singapore, but I wasn't sure how to navigate the recruiting process as a Malaysian. Technical interviews felt intimidating, and I wasn't confident about how my Malaysian degree would be perceived.",
      impact: "My mentor, who works at Amazon Singapore, helped me understand that Malaysian tech talent is highly valued in Singapore. The technical interview prep was thorough—we practiced coding problems, system design, and behavioral questions. Most importantly, my mentor helped me build confidence and understand the visa process.",
      outcome: "I got the offer from Amazon Singapore! The interview process was challenging, but I felt prepared. Now I'm working in Singapore, and the transition has been smooth thanks to my mentor's guidance on everything from visas to work culture."
    },
    {
      name: "Daniel L.",
      background: "Business, HELP University",
      result: "Offers: BCG Singapore, Deloitte KL, EY London",
      story: "I was applying to consulting firms across London, Singapore, and Malaysia without a clear strategy. I didn't understand how the recruiting processes differ or which market would be the best fit for my background.",
      impact: "My mentors in all three locations helped me understand the differences. The Singapore mentor showed me how to position myself for APAC consulting, the London mentor explained the UK market, and the KL mentor helped me understand local opportunities. I learned to tailor my approach for each market.",
      outcome: "I got offers from BCG Singapore, Deloitte KL, and EY London. My mentors helped me evaluate all three options—considering growth opportunities, work culture, and long-term career paths. I chose BCG Singapore, and I'm thrilled with my decision."
    }
  ];

  const outcomes = [
    { metric: "500+", description: "Offers at top firms", subtext: "London, Malaysia & Singapore: Goldman Sachs, McKinsey, BCG, DBS, Maybank, CIMB, Google, Amazon" },
    { metric: "85%", description: "Offer success rate", subtext: "Students receiving offers from target companies" },
    { metric: "3x", description: "Higher response rates", subtext: "After CV optimization and application strategy" },
    { metric: "70%", description: "Faster prep time", subtext: "Compared to self-study and generic resources" },
    { metric: "65%", description: "Higher interview success", subtext: "After mock interviews and targeted prep" },
    { metric: "200+", description: "Mentor network", subtext: "Industry professionals from leading firms" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Results & Success Stories
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Real transformations from Malaysian universities to opportunities in London, Malaysia, and Singapore. See how Malaysian students have transformed their career prospects with personalized mentorship.
              </p>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop"
                alt="Student success"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Measurable Outcomes
            </h2>
            <p className="text-lg text-gray-600">
              Our mentorship approach delivers real results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {outcomes.map((outcome, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl font-bold text-blue-600 mb-2">{outcome.metric}</div>
                <p className="text-lg font-semibold text-gray-900 mb-1">{outcome.description}</p>
                <p className="text-sm text-gray-600">{outcome.subtext}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center text-gray-600 text-sm">
            <p>
              * Outcomes are based on student self-reported data and may vary based on individual circumstances, effort, and market conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Student Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from students who transformed their job search and career prospects
            </p>
          </div>

          <div className="space-y-12">
            {testimonials.map((testimonial, index) => {
              const profileImages = [
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
              ];
              return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={profileImages[index % profileImages.length]}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{testimonial.name}</h3>
                          <p className="text-gray-600">{testimonial.background}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">{testimonial.result}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">The Challenge</h4>
                    <p className="text-gray-700">{testimonial.story}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How Mentorship Helped</h4>
                    <p className="text-gray-700">{testimonial.impact}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">The Result</h4>
                    <p className="text-gray-700">{testimonial.outcome}</p>
                  </div>
                </div>
              </Card>
            );
            })}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Common Transformations
            </h2>
            <p className="text-lg text-gray-600">
              Here's what typically changes during mentorship
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-red-50 border-red-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Before Mentorship</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Generic resume templates, low response rates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Anxiety about interviews, uncertainty about what to expect</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Applying everywhere without a clear strategy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>No network or guidance from industry professionals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Confusion about which roles fit their background</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">After Mentorship</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Tailored resume optimized for target roles, 3x higher response rates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Confident in interviews, prepared for what to expect</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Clear application strategy focused on best-fit roles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Network of professionals and ongoing mentorship support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Clear understanding of career path and next steps</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Ready to write your success story?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a free strategy call to discuss your goals and see how we can help.
          </p>
          <Button href="/pricing" variant="secondary" className="text-lg px-8 py-4">
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}

