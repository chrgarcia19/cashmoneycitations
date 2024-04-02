import Image from "next/image";
import MyAnimationComponent from "./components/MyAnimationComponent";
import cmcLogo from "../../../public/cashmoneycitations_logo.png";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-90 py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        {/* Hero Section */}
        <div className="flex w-full max-w-4xl flex-wrap items-center justify-around bg-white shadow-md rounded-lg p-8 mt-20">
          <div className="m-4 flex flex-1 flex-col items-center">
            <Image src={cmcLogo} alt="Cash Money Citations Logo" width={150} height={150} />
            <h2 className="mt-6 text-xl font-semibold text-gray-900">Welcome to Cash Money Citations!</h2>
            <p className="mt-2 text-gray-600">A citation generation website created by: Christian Garcia, Harris Gustafson, Thomas Hohnholt, & Hamza Faisal</p>
            <div className="mt-4 flex gap-4">
              <button className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Get Started</button>
              <button className="rounded bg-gray-300 py-2 px-4 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">Learn More</button>
            </div>
          </div>
          <div className="m-4 flex flex-1 justify-center">
            <MyAnimationComponent imgPath="/animations/booksAnimation.json" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-4xl font-bold text-blue-600">Why Choose Us?</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h4 className="text-lg font-semibold">Fast & Easy</h4>
              <p className="mt-2">Generate citations quickly with our user-friendly interface.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h4 className="text-lg font-semibold">Accurate</h4>
              <p className="mt-2">Ensure the accuracy of your references with our comprehensive database.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h4 className="text-lg font-semibold">Free to Use</h4>
              <p className="mt-2">Access our citation tools completely free of charge.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-2xl font-semibold text-center text-gray-900">What Our Users Say</h3>
          <div className="m-4 flex flex-1 justify-center my-[-150px]">
            <MyAnimationComponent imgPath="/animations/testimonialAnimation.json" />
          </div>
          <div className="flex flex-col md:flex-row justify-around items-center">
            <blockquote className="mt-4 md:mt-0 md:w-1/3 bg-blue-100 text-blue-600 p-4 shadow rounded">
              "This is the best citation tool I've used. Simple, efficient, and accurate."
            </blockquote>
            <blockquote className="md:mt-0 md:w-1/3 bg-blue-100 text-blue-600 p-4 shadow rounded">
              "Absolutely essential for my research papers. Saved me tons of time. Extremely beneficial!"
            </blockquote>
          </div>
        </div>

          {/* GitHub Repository Section */}
          <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-2xl font-semibold text-gray-900">Explore Our GitHub</h3>
          <div className="flex flex-1 justify-center my-[-150px]">
            <MyAnimationComponent imgPath="/animations/codeAnimation.json" />
          </div>
          <div className="flex justify-around items-center">
            <a href="https://github.com/chrgarcia19/cashmoneycitations" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white px-12 py-6 rounded-xl hover:bg-gray-700 transition duration-300 ease-in-out">
              View Repository
            </a>
            <a href="https://github.com/users/chrgarcia19/projects/2" target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-12 py-6 rounded-xl hover:bg-blue-400 transition duration-300 ease-in-out">
              Project Roadmap
            </a>
          </div>
          
        </div>

        {/* Contact Section */}
       <div className="mt-10 w-full max-w-7xl mx-auto">
  <h3 className="text-3xl font-extrabold text-gray-900">Contact Us</h3>
  <p className="mt-4">Have questions or feedback? We'd love to hear from you.</p>
  <div className="flex flex-col md:flex-row mt-6 space-y-6 md:space-y-0 md:space-x-6 items-start">
    <div className="flex-1 flex justify-center items-start">
      <div className="w-full" style={{ maxHeight: 'fit-content' }}>
        <MyAnimationComponent imgPath="/animations/contactAnimation.json" />
      </div>
    </div>
    <div className="flex-1 pt-20">
      <form action="#" method="POST" className="flex flex-col space-y-6">
        <input type="text" name="name" placeholder="Your Name" className="px-4 py-3 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full" style={{ height: '58px' }} />
        <input type="email" name="email" placeholder="Your Email" className="px-4 py-3 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full" style={{ height: '58px' }} />
        <textarea name="message" rows={6} placeholder="Your Message" className="px-4 py-3 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full" style={{ resize: 'none' }}></textarea>
        <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out w-full" style={{ height: '58px' }}>
          Send Message
        </button>
      </form>
    </div>
  </div>
</div>



      </main>
    </div>
  );
}
