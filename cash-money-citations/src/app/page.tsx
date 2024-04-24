import LinkBtn from "@/components/LinkBtn";
import Image from 'next/image';
import cmcLogo from '../../public/cashmoneycitations_logo.png';
import Link from "next/link";

export default function HomePage() {
  return(
    <>
      <div className="background">
        <div className='h-screen flex items-center justify-center pb-20'>
        <div className="card w-96 bg-slate-200 shadow-xl">
            <figure className="px-10 pt-10">
              <Image src={cmcLogo} alt="Cash Money Citations Logo" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Welcome to Cash Money Citations!</h2>
              <div className="card-actions">
                <p>A citation generation website created by: Christian Garcia, Harris Gustafson, Thomas Hohnholt, & Hamza Faisal</p>
              </div>
            </div>
          </div>
          <div className="card w-96 bg-slate-200 shadow-xl">
            <figure className="px-10 pt-10">
              <img src="https://avatars.githubusercontent.com/u/93625102?v=4" alt="GitHub Icon" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Cash Money Citations GitHub Repository</h2>
              <div className="card-actions">
                <LinkBtn linkData="https://github.com/chrgarcia19/cashmoneycitations" text="To GitHub" />
              </div>
            </div>
          </div>
          <div className="card w-96 bg-slate-200 shadow-xl">
          <figure className="px-10 pt-10">
            <img src="https://github.blog/wp-content/uploads/2020/07/87728232-766b4a80-c777-11ea-8f81-1d468fc360ab.png?fit=1200%2C630" alt="GitHub Icon" className="rounded-xl"/>
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Cash Money Citations Project Roadmap</h2>
            <div className="card-actions">
              <button className="linkBtn inline-block bg-gradient-to-r from-orange-400 to-orange-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200">
                <span><Link href="https://github.com/users/chrgarcia19/projects/2">To Roadmap</Link></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Contact Section */}
    <div className="my-10 w-full max-w-7xl mx-auto bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8">
      <h3 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        Contact Us
      </h3>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Have questions or feedback? We'd love to hear from you.
      </p>
      <div className="mt-8 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 items-start">
        <div className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 w-full transition ease-in-out duration-150"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 w-full transition ease-in-out duration-150"
            />
            <textarea
              name="message"
              rows={6}
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="px-4 py-3 pb-32 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 w-full transition ease-in-out duration-150"
            ></textarea>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 dark:bg-green-400 text-white px-6 py-3 rounded-lg hover:bg-green-600 dark:hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      {responseMessage && <p className="mt-4 text-gray-900 dark:text-gray-100">{responseMessage}</p>}
    </div>
  </main>
</div>
    
    </>
  );
}
