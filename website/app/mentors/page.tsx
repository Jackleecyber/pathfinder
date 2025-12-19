import Button from '@/components/Button';
import Card from '@/components/Card';
import Image from 'next/image';

export default function Mentors() {
  const mentors = [
    {
      name: "Sarah Chen",
      role: "Former McKinsey Principal (Singapore), Current VP Strategy",
      industry: "Consulting",
      experience: "12+ years in consulting across Singapore and London, led hiring for analyst programs in APAC",
      background: "Started as a business analyst in Singapore and worked her way up to Principal. Has interviewed hundreds of candidates, including many Malaysian students, and understands what consulting firms look for in the region.",
      focus: "Case interviews, behavioral prep, Singapore & London consulting recruiting, Malaysian student positioning",
      quote: "I've helped many Malaysian students navigate opportunities in Singapore and London. The key is understanding how to position your Malaysian background as a strength, not a limitation."
    },
    {
      name: "David Park",
      role: "Former Google Product Manager (Singapore), Current Head of Product",
      industry: "Tech & Product",
      experience: "10+ years in product, hiring manager for PM roles at Google Singapore and regional startups",
      background: "Made the transition from engineering to product at Google Singapore. Has hired PMs across Southeast Asia and understands the regional tech market, including opportunities for Malaysian talent.",
      focus: "Product interviews, technical PM prep, Singapore tech market, transitioning into product",
      quote: "The Singapore tech scene is vibrant and welcoming to Malaysian talent. Let's prepare you to stand out in this competitive market."
    },
    {
      name: "Maria Rodriguez",
      role: "Former Goldman Sachs VP (London), Current Director at a Hedge Fund",
      industry: "Finance",
      experience: "15+ years in finance, led campus recruiting for investment banking in London, experience with international candidates",
      background: "Spent 8 years in investment banking in London before moving to the buy side. Has extensive experience hiring international candidates, including Malaysians, and understands visa processes and cross-border opportunities.",
      focus: "Finance interviews, London banking recruiting, visa guidance, international student positioning",
      quote: "London finance is very open to Malaysian talent. I'll help you navigate the recruiting process and understand what London firms value in international candidates."
    },
    {
      name: "James Kim",
      role: "Former DBS Data Science Manager, Current Head of Analytics",
      industry: "Data & Analytics",
      experience: "8+ years in data science across Singapore and Malaysia, built analytics teams at regional banks",
      background: "Started as a data analyst at DBS Singapore and moved into data science, then management. Has hired for both technical and analytical roles in Singapore and Malaysia, understands the regional market well.",
      focus: "Data science interviews, SQL/coding prep, Singapore & Malaysia analytics market, banking analytics",
      quote: "The analytics market in Singapore and Malaysia is growing rapidly. Let's position you to take advantage of these opportunities."
    },
    {
      name: "Emily Thompson",
      role: "Former BCG Consultant (London & Singapore), Current Strategy Director",
      industry: "Consulting & Strategy",
      experience: "11+ years in strategy consulting across London and Singapore, case interview trainer",
      background: "Spent 7 years at BCG in both London and Singapore offices. Has trained hundreds of candidates on case interviews and understands the differences between UK and APAC consulting recruiting.",
      focus: "Case interviews, fit interviews, London & Singapore consulting, cross-market strategy",
      quote: "Having worked in both London and Singapore, I understand the nuances of each market. Let's figure out which is the right fit for you."
    },
    {
      name: "Alex Kumar",
      role: "Former JPMorgan VP (London), Current Director at Maybank",
      industry: "Finance & Banking",
      experience: "12+ years in banking, worked at JPMorgan London and now at Maybank KL, understands both international and local markets",
      background: "Started at JPMorgan London and transitioned to Maybank in Kuala Lumpur. Has unique perspective on both international and Malaysian banking markets, understands what Malaysian students need to succeed in both.",
      focus: "Banking interviews, London finance recruiting, Malaysian banking market, cross-border opportunities",
      quote: "I've been on both sides—international banking in London and local banking in Malaysia. I can help you understand your options and what each path offers."
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
                Meet Our Mentors
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Real professionals with experience in London, Malaysia, and Singapore. Our mentors understand cross-border opportunities and know what it takes for Malaysian students to succeed in these markets.
              </p>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
                alt="Professional mentors"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Mentors Matter */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop"
                  alt="Industry Experience"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Experience</h3>
              <p className="text-gray-600">
                Every mentor has worked at top firms and understands what it takes to get hired in their field. They know the process from the inside.
              </p>
            </Card>

            <Card>
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop"
                  alt="Hiring Authority"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hiring Authority</h3>
              <p className="text-gray-600">
                Many mentors have been on hiring committees and interview panels. They know what decision-makers actually look for, not just what looks good on paper.
              </p>
            </Card>

            <Card>
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                  alt="Relatable Guidance"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Relatable Guidance</h3>
              <p className="text-gray-600">
                We believe in mentorship over gatekeeping. Our mentors focus on empowering you with practical, actionable advice—not impressing you with credentials.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Mentor Profiles */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {mentors.map((mentor, index) => {
              const profileImages = [
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face"
              ];
              return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={profileImages[index % profileImages.length]}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{mentor.name}</h2>
                    <p className="text-blue-600 font-medium">{mentor.role}</p>
                    <p className="text-sm text-gray-500 mt-1">{mentor.industry}</p>
                  </div>
                </div>

                <div className="border-l-4 border-blue-600 pl-4 mb-4">
                  <p className="text-gray-700 italic">"{mentor.quote}"</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Experience</h3>
                    <p className="text-gray-600 text-sm">{mentor.experience}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Background</h3>
                    <p className="text-gray-600 text-sm">{mentor.background}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Specializes In</h3>
                    <p className="text-gray-600 text-sm">{mentor.focus}</p>
                  </div>
                </div>
              </Card>
            );
            })}
          </div>
        </div>
      </section>

      {/* How Matching Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              How We Match You
            </h2>
            <p className="text-lg text-gray-600">
              We don't just assign you to anyone. The matching process considers multiple factors to ensure you get the right mentor.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  1
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Alignment</h3>
                <p className="text-gray-600">
                  We match you with mentors who have experience in your target industry and understand the specific requirements and culture of those roles.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  2
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hiring Experience</h3>
                <p className="text-gray-600">
                  We prioritize mentors who have actual hiring authority or extensive interview experience, so they can give you insights from the decision-maker's perspective.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  3
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Communication Style</h3>
                <p className="text-gray-600">
                  We consider your communication preferences and learning style to ensure you work well with your mentor. Good mentorship is about connection, not just credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  4
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Similarity</h3>
                <p className="text-gray-600">
                  When possible, we match you with mentors who have similar backgrounds or career paths, so they can relate to your journey and provide more relevant guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Ready to find your mentor?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a free strategy call to discuss your goals and we'll match you with the right mentor.
          </p>
          <Button href="/pricing" variant="secondary" className="text-lg px-8 py-4">
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}

