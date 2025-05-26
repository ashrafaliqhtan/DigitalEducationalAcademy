export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Educational Academy</h1>

        <div className="prose max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Educational Academy is a premier digital educational platform dedicated to helping students achieve academic
            excellence through quality educational services and resources.
          </p>

          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="mb-6">
            To provide comprehensive academic support and innovative learning solutions that empower students to reach
            their full potential and succeed in their educational journey.
          </p>

          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="mb-6">
            To be the leading educational platform in the Arabian Gulf region, recognized for our commitment to academic
            excellence and student success.
          </p>

          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Professional programming and development services</li>
            <li>Research methodology and academic writing support</li>
            <li>Presentation design and template creation</li>
            <li>Comprehensive online courses</li>
            <li>Custom academic solutions</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Expert instructors with industry experience</li>
            <li>Personalized learning approach</li>
            <li>High-quality educational resources</li>
            <li>Proven track record of student success</li>
            <li>Continuous support and guidance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
