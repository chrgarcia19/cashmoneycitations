import React from "react";
import { FaSearch, FaFileExport, FaGlobeAmericas, FaBook, FaBarcode, FaIdBadge, FaKey } from "react-icons/fa"; // Added icons for each feature

const Dashboard = () => {
  // Updated list of features with separate cards for DOI, ISSN, ISBN
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
    <div className="min-h-screen bg-gray-100 py-10 px-5 md:px-10">
      <h1 className="text-center text-4xl font-bold text-gray-800 mb-10">Welcome to Your Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-4">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
