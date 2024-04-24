"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import MyAnimationComponent from "../components/MyAnimationComponent";
import cmcLogo from "../../public/cashmoneycitations_logo.png";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { data: session, status } = useSession(); // Use useSession to access the session
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setShowDashboard(true);
    } else {
      setShowDashboard(false);
    }
  }, [status]);


  // Update form data as user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form data to API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formPayload = JSON.stringify({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });
  
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: formPayload,
      });
      const data = await response.json();
  
      if (data.success) {
        setResponseMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form on success
      } else {
        setResponseMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
    {/* Hero Section */}
    <div className="flex w-full max-w-4xl flex-wrap items-center justify-around bg-white dark:bg-gray-700 shadow-md dark:shadow-xl rounded-lg p-8 mt-32 border border-gray-200 dark:border-gray-700">
      <div className="m-4 flex flex-1 flex-col items-center">
        <Image
          src={cmcLogo}
          alt="Cash Money Citations Logo"
          width={150}
          height={150}
        />
        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Welcome to Cash Money Citations!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          A citation generation website created by: Christian Garcia,
          Harris Gustafson, Thomas Hohnholt, & Hamza Faisal
        </p>
        <div className="mt-4 flex gap-4">
          <Link
            href="/login"
            className="rounded bg-blue-500 dark:bg-blue-400 py-2 px-4 text-white hover:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50"
          >
            Get Started
          </Link>
          <button className="rounded bg-gray-300 dark:bg-gray-700 py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-opacity-50">
            Learn More
          </button>
        </div>
      </div>
      <div className="m-4 flex flex-1 justify-center">
        <MyAnimationComponent imgPath="/animations/booksAnimation.json" />
      </div>
    </div>

    {/* Features Section */}
    <div className="mt-32 w-full max-w-4xl">
      <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
        Why Choose Us?
      </h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-gray-700 shadow-md dark:shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Fast & Easy</h4>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Generate citations quickly with our user-friendly interface.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-700 shadow-md dark:shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Accurate</h4>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Ensure the accuracy of your references with our comprehensive database.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-700 shadow-md dark:shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Free to Use</h4>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Access our citation tools completely free of charge.
          </p>
        </div>
      </div>
    </div>

    {/* GitHub Repository Section */}
    <div className="mt-10 w-full max-w-4xl flex justify-around items-stretch space-x-4">
      {/* Card for View Repository */}
      <div className="flex-1 bg-white dark:bg-gray-700 shadow-lg dark:shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <img
          src="https://avatars.githubusercontent.com/u/93625102?v=4"
          alt="Repository Image"
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <button
            onClick={() =>
              window.open(
                "https://github.com/chrgarcia19/cashmoneycitations",
                "_blank"
              )
            }
            className="w-full bg-gray-800 dark:bg-gray-900 text-white px-12 py-6 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-800 transition duration-300 ease-in-out"
          >
            View Repository
          </button>
        </div>
      </div>

      {/* Card for Project Roadmap */}
      <div className="flex-1 bg-white dark:bg-gray-700 shadow-lg dark:shadow-xl rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <img
          src="https://github.blog/wp-content/uploads/2020/07/87728232-766b4a80-c777-11ea-8f81-1d468fc360ab.png?fit=1200%2C630"
          alt="Roadmap Image"
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <button
            onClick={() =>
              window.open(
                "https://github.com/users/chrgarcia19/projects/2",
                "_blank"
              )
            }
            className="w-full bg-blue-500 dark:bg-blue-400 text-white px-12 py-6 rounded-xl hover:bg-blue-400 dark:hover:bg-blue-300 transition duration-300 ease-in-out"
          >
            Project Roadmap
          </button>
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