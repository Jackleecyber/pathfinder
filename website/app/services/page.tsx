import Button from '@/components/Button';
import Card from '@/components/Card';
import Image from 'next/image';

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Our Services
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Comprehensive support for Malaysian students targeting opportunities in London, Malaysia, and Singapore. No generic advice—just personalized guidance that understands cross-border recruiting.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <p className="text-sm text-gray-600 mt-1">Offer Success Rate</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">200+</div>
                  <p className="text-sm text-gray-600 mt-1">Mentor Network</p>
                </div>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                alt="Career services and mentorship"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* CV & Resume Optimization */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"
                    alt="CV and Resume Optimization"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  CV & Resume Optimization
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  You don't need another generic template. You need someone who's reviewed thousands of resumes and knows what actually stands out to recruiters and hiring managers.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Line-by-Line Review</h3>
                      <p className="text-gray-600">
                        Every bullet point, every word matters. Get specific feedback on how to strengthen your descriptions, highlight impact, and avoid common mistakes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">ATS Optimization</h3>
                      <p className="text-gray-600">
                        Ensure your resume passes applicant tracking systems and reaches human reviewers. We know what keywords and formats actually work.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Industry-Specific Formatting</h3>
                      <p className="text-gray-600">
                        Finance, consulting, tech, product—each industry has different expectations. We'll format your resume for your target field.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Multiple Versions</h3>
                      <p className="text-gray-600">
                        Tailored versions for different roles or industries. One size doesn't fit all, and we'll help you create versions that speak directly to each opportunity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-4">What's included:</h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Comprehensive resume review and feedback</li>
                  <li>• Multiple rounds of revisions</li>
                  <li>• Industry-specific templates</li>
                  <li>• Cover letter optimization (if needed)</li>
                  <li>• LinkedIn profile review</li>
                </ul>
                <p className="text-sm text-gray-600 italic">
                  Most students see a significant improvement in response rates after optimization.
                </p>
              </Card>
            </div>

            {/* Interview Preparation */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop"
                    alt="Interview Preparation"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Interview Preparation
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Practice with real questions from your target companies. Get honest feedback that builds confidence, not anxiety. Learn to think through problems and communicate clearly under pressure.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Mock Interviews</h3>
                      <p className="text-gray-600">
                        Behavioral and technical mock interviews with real questions from your target companies. Video-recorded sessions with detailed feedback on content, delivery, and presence.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Behavioral Prep</h3>
                      <p className="text-gray-600">
                        STAR method mastery, story development, and practice with common behavioral questions. Learn to tell compelling stories that demonstrate impact.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Technical Interview Prep</h3>
                      <p className="text-gray-600">
                        For tech, product, and analytics roles. Practice coding problems, case studies, system design, and data analysis with mentors who've conducted these interviews.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Case Interview Prep</h3>
                      <p className="text-gray-600">
                        For consulting roles. Framework development, problem-solving structure, and practice with real case studies. Learn to think like a consultant.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="bg-gray-50 md:order-1">
                <h3 className="font-semibold text-gray-900 mb-4">What's included:</h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Multiple mock interview sessions</li>
                  <li>• Industry-specific question banks</li>
                  <li>• Video playback and analysis</li>
                  <li>• Feedback on verbal and non-verbal communication</li>
                  <li>• Pre-interview briefing sessions</li>
                </ul>
                <p className="text-sm text-gray-600 italic">
                  Practice until you feel confident, not just prepared.
                </p>
              </Card>
            </div>

            {/* Career Strategy */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
                    alt="Career Strategy"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Career Strategy & Networking
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Develop a clear roadmap for your career. Understand what roles fit your background, how to position yourself strategically, and build the network you need to succeed.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Career Roadmapping</h3>
                      <p className="text-gray-600">
                        Identify target roles that align with your skills and interests. Understand career progression paths and make informed decisions about your next move.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Personal Branding</h3>
                      <p className="text-gray-600">
                        Learn how to position yourself effectively. Develop a clear narrative about your background, skills, and value proposition.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Networking Strategy</h3>
                      <p className="text-gray-600">
                        Build meaningful professional relationships. Learn how to reach out to professionals, follow up effectively, and leverage your network strategically.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Application Strategy</h3>
                      <p className="text-gray-600">
                        Develop a targeted application approach. Learn which companies to target, when to apply, and how to prioritize your efforts for maximum impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-4">What's included:</h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Career goal setting and planning sessions</li>
                  <li>• Industry research and role analysis</li>
                  <li>• Networking templates and scripts</li>
                  <li>• Application prioritization framework</li>
                  <li>• Long-term career development guidance</li>
                </ul>
                <p className="text-sm text-gray-600 italic">
                  Build a career strategy that works for you, not against you.
                </p>
              </Card>
            </div>

            {/* Ongoing Mentorship */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                    alt="Ongoing Mentorship"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ongoing Mentorship Plans
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Long-term support for sustained career growth. Not just getting the offer—building the skills and confidence you need throughout your career journey.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Regular 1-on-1 Sessions</h3>
                      <p className="text-gray-600">
                        Weekly or bi-weekly sessions to track progress, address challenges, and refine your approach. Consistent support when you need it most.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Application Review</h3>
                      <p className="text-gray-600">
                        Review applications before you submit them. Get feedback on tailored resumes, cover letters, and application answers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Offer Negotiation</h3>
                      <p className="text-gray-600">
                        Guidance on evaluating offers, negotiating salary and benefits, and making informed decisions about your next role.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Career Transition Support</h3>
                      <p className="text-gray-600">
                        Whether you're pivoting industries or roles, get strategic guidance on making successful transitions throughout your career.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="bg-gray-50 md:order-1">
                <h3 className="font-semibold text-gray-900 mb-4">What's included:</h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Regular mentorship sessions</li>
                  <li>• Priority document review</li>
                  <li>• Ongoing access to resources</li>
                  <li>• Quick turnaround on questions</li>
                  <li>• Long-term career development</li>
                </ul>
                <p className="text-sm text-gray-600 italic">
                  Mentorship that grows with you, not just one-off sessions.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Ready to get personalized support?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a free strategy call to discuss which services are right for you.
          </p>
          <Button href="/pricing" variant="secondary" className="text-lg px-8 py-4">
            See Pricing & Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}

