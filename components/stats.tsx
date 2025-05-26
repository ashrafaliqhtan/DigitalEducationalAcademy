import AnimatedCounter from "@/components/ui/animated-counter"

const Stats = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Impact</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by thousands
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            We've helped countless individuals and businesses achieve their goals. Here's a glimpse of our success.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  {/* Heroicon name: outline/globe-alt */}
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5.5a2.5 2.5 0 012.5 2.5V19a2.5 2.5 0 01-2.5 2.5H3.055a2.5 2.5 0 01-2.5-2.5V13.5a2.5 2.5 0 012.5-2.5zM8 5.859V16.5a2.5 2.5 0 01-2.5 2.5H5.057a2.5 2.5 0 01-2.5-2.5V5.859a2.5 2.5 0 012.5-2.5H5.5a2.5 2.5 0 012.5 2.5zM12.943 5.859V16.5a2.5 2.5 0 01-2.5 2.5H10.44a2.5 2.5 0 01-2.5-2.5V5.859a2.5 2.5 0 012.5-2.5h.443a2.5 2.5 0 012.5 2.5zM17.943 5.859V16.5a2.5 2.5 0 01-2.5 2.5H15.44a2.5 2.5 0 01-2.5-2.5V5.859a2.5 2.5 0 012.5-2.5h.443a2.5 2.5 0 012.5 2.5z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Happy Customers</p>
              </dt>
              <dd className="mt-2 ml-16 text-3xl text-gray-500">
                <AnimatedCounter end={5000} suffix="+" />
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  {/* Heroicon name: outline/scale */}
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.002 0M3 6V4m0 2l5 10m6-3l-3 9a5.002 5.002 0 006.002 0M18 7l3 9m-3-9V4m3 2l-5 10"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Projects Completed</p>
              </dt>
              <dd className="mt-2 ml-16 text-3xl text-gray-500">
                <AnimatedCounter end={2500} suffix="+" />
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  {/* Heroicon name: outline/lightning-bolt */}
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Years of Experience</p>
              </dt>
              <dd className="mt-2 ml-16 text-3xl text-gray-500">
                <AnimatedCounter end={10} suffix="+" />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Stats
