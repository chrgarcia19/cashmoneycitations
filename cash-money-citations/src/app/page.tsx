"use client";

import Image from "next/image";
import MyAnimationComponent from "../components/MyAnimationComponent";
import cmcLogo from "../../public/cashmoneycitations_logo.png";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          {/* Hero Section */}
          <div className="flex w-full max-w-4xl flex-wrap items-center justify-around bg-white shadow-md rounded-lg p-8 mt-32">
            <div className="m-4 flex flex-1 flex-col items-center">
              <Image
                src={cmcLogo}
                alt="Cash Money Citations Logo"
                width={150}
                height={150}
              />
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                Welcome to Cash Money Citations!
              </h2>
              <p className="mt-2 text-gray-600">
                A citation generation website created by: Christian Garcia,
                Harris Gustafson, Thomas Hohnholt, & Hamza Faisal
              </p>
              <div className="mt-4 flex gap-4">
                <Link href ="/login" className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  Get Started
                </Link>
                <button className="rounded bg-gray-300 py-2 px-4 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">
                  Learn More
                </button>
              </div>
            </div>
            <div className="m-4 flex flex-1 justify-center">
              {/* <MyAnimationComponent imgPath="/animations/booksAnimation.json" /> */}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32 w-full max-w-4xl">
            <h3 className="text-4xl font-bold text-blue-600">Why Choose Us?</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white shadow-md rounded-lg">
                <h4 className="text-lg font-semibold">Fast & Easy</h4>
                <p className="mt-2">
                  Generate citations quickly with our user-friendly interface.
                </p>
              </div>
              <div className="p-6 bg-white shadow-md rounded-lg">
                <h4 className="text-lg font-semibold">Accurate</h4>
                <p className="mt-2">
                  Ensure the accuracy of your references with our comprehensive
                  database.
                </p>
              </div>
              <div className="p-6 bg-white shadow-md rounded-lg">
                <h4 className="text-lg font-semibold">Free to Use</h4>
                <p className="mt-2">
                  Access our citation tools completely free of charge.
                </p>
              </div>
            </div>
          </div>

          {/* GitHub Repository Section */}
          <div className="mt-10 w-full max-w-4xl flex justify-around items-stretch space-x-4">
  {/* Card for View Repository */}
  <div className="flex-1 bg-white shadow-lg rounded-2xl overflow-hidden">
    <img src="https://avatars.githubusercontent.com/u/93625102?v=4" alt="Repository Image" className="w-full h-48 object-cover rounded-t-2xl" />
    <div className="p-6">
      <button
        onClick={() => window.open("https://github.com/chrgarcia19/cashmoneycitations", "_blank")}
        className="w-full bg-gray-800 text-white px-12 py-6 rounded-xl hover:bg-gray-700 transition duration-300 ease-in-out"
      >
        View Repository
      </button>
    </div>
  </div>

  {/* Card for Project Roadmap */}
  <div className="flex-1 bg-white shadow-lg rounded-3xl overflow-hidden">
    <img src="https://github.blog/wp-content/uploads/2020/07/87728232-766b4a80-c777-11ea-8f81-1d468fc360ab.png?fit=1200%2C630" alt="Roadmap Image" className="w-full h-48 object-cover rounded-t-2xl" />
    <div className="p-6">
      <button
        onClick={() => window.open("https://github.com/users/chrgarcia19/projects/2", "_blank")}
        className="w-full bg-blue-500 text-white px-12 py-6 rounded-xl hover:bg-blue-400 transition duration-300 ease-in-out"
      >
        Project Roadmap
      </button>
    </div>
  </div>
</div>


          {/* Contact Section */}
          <div className="mt-10 w-full max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-8">
  <h3 className="text-3xl font-extrabold text-gray-900">
    Contact Us
  </h3>
  <p className="mt-4 text-gray-600">
    Have questions or feedback? We'd love to hear from you.
  </p>
  <div className="mt-8 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 items-start">
    <div className="flex-1">
      <form
        action="#"
        method="POST"
        className="flex flex-col space-y-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full transition ease-in-out duration-150"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full transition ease-in-out duration-150"
        />
        <textarea
          name="message"
          rows={6}
          placeholder="Your Message"
          className="px-4 py-3 pb-32 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full transition ease-in-out duration-150"
        ></textarea>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
</div>

        </main>
      </div>
    </>
  );
}
