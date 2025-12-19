import Button from '@/components/Button';
import Card from '@/components/Card';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Turn uncertainty into clarity.
                <br />
                <span className="text-blue-600">From Malaysia to global opportunities.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Built for Malaysian students. Get personalized mentorship from industry professionals who understand the UK, Malaysian, and Singapore markets. 
                Build your CV, ace interviews, and navigate cross-border opportunities with confidence.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <Button href="/pricing" variant="primary" className="text-lg px-8 py-4">
                  Book a Free Strategy Call
                </Button>
                <Button href="/how-it-works" variant="outline" className="text-lg px-8 py-4">
                  See How It Works
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
        <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
                alt="Professional mentorship and career coaching"
                fill
                className="object-cover"
          priority
        />
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-gradient-to-b from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <p className="text-blue-100 text-sm md:text-base">Offers at Top Firms</p>
              <p className="text-blue-200 text-xs mt-1">As of Dec 2024</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">85%</div>
              <p className="text-blue-100 text-sm md:text-base">Offer Success Rate</p>
              <p className="text-blue-200 text-xs mt-1">Students receiving offers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">200+</div>
              <p className="text-blue-100 text-sm md:text-base">Mentor Network</p>
              <p className="text-blue-200 text-xs mt-1">Industry professionals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">5+</div>
              <p className="text-blue-100 text-sm md:text-base">Years of Results</p>
              <p className="text-blue-200 text-xs mt-1">Proven track record</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Logos */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-500 mb-4">
            Malaysian students have landed offers at
          </p>
          <p className="text-center text-xs text-gray-400 mb-8">
            In London • Malaysia • Singapore
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">Goldman Sachs</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">McKinsey</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">BCG</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">JPMorgan</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">DBS</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">Maybank</div>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center mt-4">
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">Google</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">Amazon</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">CIMB</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">UOB</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">OCBC</div>
            </div>
            <div className="relative h-10 w-24 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-600 font-semibold text-sm">EY</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Stages of Pathfinder Support */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              The 5 Stages of Pathfinder Support
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              A comprehensive, structured journey from career exploration to offer acceptance. Each stage builds on the last, ensuring you're prepared at every step.
            </p>
          </div>

          <div className="space-y-12 mb-16">
            {/* Stage 1 */}
            <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl p-8">
              <div>
                <div className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold w-12 h-12 mb-4">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Career Exploration & Strategy</h3>
                <p className="text-gray-600 mb-4">
                  Understand your options, identify target roles, and develop a clear career roadmap. We help you figure out what you actually want—not just what sounds impressive.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Career goal setting and industry research</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Role fit analysis and background assessment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Personalized mentorship matching</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
                  alt="Career exploration"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Stage 2 */}
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl p-8 border-2 border-gray-100">
              <div className="md:order-2">
                <div className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold w-12 h-12 mb-4">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Resume Building & Optimization</h3>
                <p className="text-gray-600 mb-4">
                  Transform your resume from generic to compelling. Get line-by-line feedback from mentors who've reviewed thousands of applications.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-blue-600">3x higher</p>
                  <p className="text-sm text-blue-700">response rates after optimization</p>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>ATS optimization and keyword strategy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Industry-specific formatting</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-64 w-full rounded-lg overflow-hidden md:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"
                  alt="Resume building"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Stage 3 */}
            <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl p-8">
              <div>
                <div className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold w-12 h-12 mb-4">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Technical & Behavioral Skills</h3>
                <p className="text-gray-600 mb-4">
                  Master the skills that matter. Practice with real questions from your target firms, not generic templates.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-blue-600">70% faster</p>
                  <p className="text-sm text-blue-700">prep time compared to self-study</p>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Mock interviews with industry-specific questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Case study prep (consulting) or technical prep (tech/finance)</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop"
                  alt="Skills development"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Stage 4 */}
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl p-8 border-2 border-gray-100">
              <div className="md:order-2">
                <div className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold w-12 h-12 mb-4">
                  4
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Networking & Application Strategy</h3>
                <p className="text-gray-600 mb-4">
                  Build meaningful connections and submit applications that get noticed. Learn the strategies that actually work.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-blue-600">80% reduction</p>
                  <p className="text-sm text-blue-700">in trial-and-error time</p>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Networking templates and outreach strategies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Application review before submission</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-64 w-full rounded-lg overflow-hidden md:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Networking"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Stage 5 */}
            <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl p-8">
              <div>
                <div className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold w-12 h-12 mb-4">
                  5
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Mock Interviews & Final Prep</h3>
                <p className="text-gray-600 mb-4">
                  Practice until you're confident, not just prepared. Get honest feedback from mentors who've conducted real interviews.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-blue-600">65% higher</p>
                  <p className="text-sm text-blue-700">interview success rate</p>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Video-recorded mock interviews with detailed feedback</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Firm-specific prep for London, Malaysia, and Singapore offices (Goldman Sachs, McKinsey, DBS, Maybank, etc.)</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                  alt="Mock interviews"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button href="/how-it-works" variant="primary" className="text-lg px-8 py-4">
              Learn More About Our Process
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What You Get
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive support across every step of your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
                  alt="CV and Resume Optimization"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CV & Resume Optimization</h3>
              <p className="text-gray-600">
                You don't need another generic template. Get personalized feedback from someone who's reviewed thousands of resumes and knows what actually stands out.
              </p>
            </Card>

            <Card>
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop"
                  alt="Interview Preparation"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Preparation</h3>
              <p className="text-gray-600">
                Practice behavioral and technical interviews with real questions from your target companies. Get honest feedback that builds confidence, not anxiety.
              </p>
            </Card>

            <Card>
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
                  alt="Career Strategy"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Strategy</h3>
              <p className="text-gray-600">
                Develop a clear roadmap for your career. Understand what roles fit your background, how to position yourself, and build the network you need.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button href="/services" variant="primary">
              Explore All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Mentor Credibility */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Real Mentors, Real Experience
            </h2>
            <p className="mt-4 text-lg text-gray-600 mb-8">
              Our mentors aren't just successful—they've hired people like you
            </p>
            <div className="bg-blue-50 rounded-xl p-8 max-w-2xl mx-auto mb-12">
              <div className="text-4xl font-bold text-blue-600 mb-2">200+ Mentors</div>
              <p className="text-gray-700">
                From leading firms in London, Malaysia, and Singapore including Goldman Sachs, McKinsey, BCG, JPMorgan, DBS, Maybank, CIMB, UOB, Google, Amazon, and more
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Each Malaysian student gets matched with 3-5 mentors who understand cross-border opportunities and regional markets
              </p>
            </div>
          </div>

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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Experience</h3>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hiring Authority</h3>
              <p className="text-gray-600">
                Many of our mentors have been on hiring committees and interview panels. They know what decision-makers actually look for.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Relatable Guidance</h3>
              <p className="text-gray-600">
                We believe in mentorship over gatekeeping. Our mentors focus on empowering you, not impressing you with their credentials.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button href="/mentors" variant="outline">
              Meet Our Mentors
            </Button>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Malaysian Student Success Stories
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real transformations from Malaysian universities to global opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
                    alt="Aisyah"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Aisyah, Finance Major (UM)</p>
                  <p className="text-sm text-gray-600">Offers: McKinsey Singapore, BCG London, DBS</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "As a Malaysian student, I wasn't sure how to position myself for opportunities in London and Singapore. My mentor helped me understand the differences in recruiting processes across markets and how to highlight my Malaysian background as a strength. I got offers from all three locations!"
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="Wei Ming"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Wei Ming, Computer Science (USM)</p>
                  <p className="text-sm text-gray-600">Offer: Google Singapore, Product Manager</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The mock interviews were game-changing. My mentor, who works at Google Singapore, gave me insights into how tech interviews differ between Malaysia and Singapore. The preparation was specific to the regional market, not generic advice."
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                    alt="Priya"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Priya, Business Analytics (UTM)</p>
                  <p className="text-sm text-gray-600">Offer: JPMorgan London, Maybank KL</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I thought my CV was fine until I got feedback from mentors in both London and KL. They helped me understand how to tailor my application for different markets. The difference in response rates was incredible—I got interviews at both international and local firms."
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                    alt="Hafiz"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Hafiz, Economics (UKM)</p>
                  <p className="text-sm text-gray-600">Offers: Goldman Sachs London, CIMB KL</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The career strategy sessions helped me understand my options across London, Malaysia, and Singapore. My mentor helped me navigate visa requirements, salary expectations, and cultural differences. I ended up choosing Goldman London, but having options in all three markets gave me confidence."
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button href="/results" variant="primary">
              Read More Success Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Ready to turn preparation into confidence?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a free strategy call. No commitment, no pressure—just honest conversation about your goals.
          </p>
          <Button href="/pricing" variant="secondary" className="text-lg px-8 py-4">
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
}
