import React from "react";
import { FaFileExport, FaGlobeAmericas, FaBook, FaBarcode, FaIdBadge, FaKey } from "react-icons/fa";

const Dashboard = () => {
  const features = [
    {
      icon: <FaBook className="text-4xl" />,
      title: "Citation Styles",
      description: "Access a wide range of citation styles including APA, MLA, Chicago, and more.",
    },
    {
      icon: <FaGlobeAmericas className="text-4xl" />,
      title: "Multiple Languages",
      description: "Generate citations in different languages to meet your research needs.",
    },
    {
      icon: <FaFileExport className="text-4xl" />,
      title: "Export Options",
      description: "Export your citations in various formats like Word, PDF, and Google Docs.",
    },
    {
      icon: <FaBarcode className="text-4xl" />,
      title: "Search by DOI",
      description: "Directly use Digital Object Identifiers (DOI) to find and cite academic papers.",
    },
    {
      icon: <FaIdBadge className="text-4xl" />,
      title: "Search by ISSN",
      description: "Utilize International Standard Serial Numbers (ISSN) for journal and serial identification.",
    },
    {
      icon: <FaKey className="text-4xl" />,
      title: "Search by ISBN",
      description: "Leverage International Standard Book Numbers (ISBN) for book and monograph citations.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 py-10 px-5 md:px-10">
    <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-200 mb-10">Welcome to Your Dashboard</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div key={index}
          className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 hover:shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="text-blue-500 dark:text-blue-300 mb-4">
              {feature.icon}
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{feature.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Dashboard;
