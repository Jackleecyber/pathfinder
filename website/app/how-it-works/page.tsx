import Button from '@/components/Button';
import Card from '@/components/Card';
import Image from 'next/image';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                How It Works
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                A clear roadmap for Malaysian students targeting opportunities in London, Malaysia, and Singapore. No guesswork, no generic advice—just structured guidance that understands cross-border recruiting.
              </p>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                alt="How mentorship works"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Journey */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop"
                    alt="Strategy call"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 mb-4">
                  Step 1
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Initial Strategy Call (30 minutes)
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  We start with a conversation, not a sales pitch. This call is about understanding:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Your career goals and target roles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Your current background and experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Specific challenges you're facing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Timeline and priorities</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  By the end of the call, you'll have a clear sense of whether we're a good fit and what the path forward looks like. No pressure to commit—just honest, helpful guidance.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">What to expect:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• We'll review your CV/resume together</li>
                  <li>• Discuss your target companies and roles</li>
                  <li>• Identify gaps and opportunities</li>
                  <li>• Outline a potential mentorship plan</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                    alt="Mentor matching"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 mb-4">
                  Step 2
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Mentor Matching & Onboarding
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Once you're ready to start, we match you with a mentor who:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Has experience in your target industry and role</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Has hiring authority or extensive interview experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Understands your background and can relate to your journey</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  We don't just assign you to anyone. The matching process considers your goals, communication style, and specific needs. Your mentor becomes a trusted advisor, not just a consultant.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 md:order-1">
                <h3 className="font-semibold text-gray-900 mb-4">In your first week:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Introduction call with your mentor</li>
                  <li>• Deep dive into your goals and timeline</li>
                  <li>• Initial assessment of your materials</li>
                  <li>• Custom roadmap based on your needs</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
                    alt="Structured preparation"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 mb-4">
                  Step 3
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Structured Preparation Sessions
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Your mentorship journey follows a structured approach, but it's tailored to your specific needs:
                </p>
                
                <div className="space-y-6 mb-6">
                  <Card className="border-l-4 border-l-blue-600">
                    <h3 className="font-semibold text-gray-900 mb-2">CV & Resume Optimization</h3>
                    <p className="text-gray-600 text-sm">
                      Line-by-line feedback, ATS optimization, and strategic positioning. We'll help you highlight what matters and cut through the noise.
                    </p>
                  </Card>

                  <Card className="border-l-4 border-l-blue-600">
                    <h3 className="font-semibold text-gray-900 mb-2">Interview Preparation</h3>
                    <p className="text-gray-600 text-sm">
                      Mock interviews with real questions, behavioral prep, technical practice, and honest feedback that builds genuine confidence.
                    </p>
                  </Card>

                  <Card className="border-l-4 border-l-blue-600">
                    <h3 className="font-semibold text-gray-900 mb-2">Career Strategy & Networking</h3>
                    <p className="text-gray-600 text-sm">
                      Learn how to position yourself, build meaningful connections, and navigate the application process strategically.
                    </p>
                  </Card>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Session format:</h3>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li>• Weekly or bi-weekly 1-on-1 sessions</li>
                  <li>• Video calls with screen sharing</li>
                  <li>• Real-time feedback and document review</li>
                  <li>• Actionable homework between sessions</li>
                </ul>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Between sessions:</strong> You'll have access to resources, templates, and can ask questions via message. We're here to support you, not just meet with you.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                    alt="Ongoing support"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 mb-4">
                  Step 4
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ongoing Support & Application Guidance
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Mentorship doesn't end after one session. We're here for the long term:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Review applications before you submit them</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Mock interviews before real ones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Offer negotiation support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Career strategy for long-term growth</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Whether you're applying to internships, graduate programs, or making a career pivot, we provide the guidance you need at every step.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 md:order-1">
                <h3 className="font-semibold text-gray-900 mb-4">What you get:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Document templates and resources</li>
                  <li>• Industry-specific interview questions</li>
                  <li>• Networking strategies and templates</li>
                  <li>• Access to our mentor network</li>
                  <li>• Ongoing support between sessions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools and Feedback */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Tools & Resources You'll Receive
            </h2>
            <p className="text-lg text-gray-600">
              Practical resources that make a real difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
                  alt="Document Templates"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Document Templates</h3>
              <p className="text-gray-600">
                Professionally designed CV/resume templates optimized for ATS systems and recruiter scanning.
              </p>
            </Card>

            <Card>
              <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop"
                  alt="Interview Question Banks"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interview Question Banks</h3>
              <p className="text-gray-600">
                Industry-specific question sets with example answers and frameworks for behavioral and technical interviews.
              </p>
            </Card>

            <Card>
              <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
                  alt="Cover Letter Guides"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cover Letter Guides</h3>
              <p className="text-gray-600">
                Templates and strategies for writing cover letters that actually get read and remembered.
              </p>
            </Card>

            <Card>
              <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                  alt="Networking Templates"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Networking Templates</h3>
              <p className="text-gray-600">
                Email templates and strategies for reaching out to professionals, following up, and building relationships.
              </p>
            </Card>

            <Card>
              <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                  alt="Application Tracking"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Application Tracking</h3>
              <p className="text-gray-600">
                Tools to organize your applications, track deadlines, and stay on top of your job search.
              </p>
            </Card>

            <Card>
              <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
                  alt="Ongoing Feedback"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ongoing Feedback</h3>
              <p className="text-gray-600">
                Review your materials and applications anytime between sessions. Quick turnaround, actionable feedback.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book a free strategy call to discuss your goals and see if we're a good fit.
          </p>
          <Button href="/pricing" variant="primary" className="text-lg px-8 py-4">
            Book Your Free Strategy Call
          </Button>
        </div>
      </section>
    </div>
  );
}

