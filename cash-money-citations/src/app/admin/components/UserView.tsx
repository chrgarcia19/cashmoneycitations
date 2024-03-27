"use client";

import { useRouter } from "next/navigation";
import React, { startTransition, useState, useTransition } from "react";

// Local imports
import CustomDropdown from './CustomDropdown';


export default function UserView(user: any) {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [userEmail, setUserEmail] = useState<string[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, email: any) {
    if (e.target.checked) {
      setUserEmail([...userEmail, email]);
    } else {
      setUserEmail(userEmail.filter((userEmail) => userEmail !== email));
    }
  }

  async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsFetching(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Add userEmail to the form data
    userEmail.forEach((email) => {
      formData.append(`userEmail`, email);
    });
    await fetch("/api/auth/updateUser", { method: "PUT", body: formData });
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleDeleteUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Add userEmail to the form data
    userEmail.forEach((email) => {
      formData.append(`userEmail`, email);
    });
    await fetch("/api/auth/updateUser", { method: "DELETE", body: formData });
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <tr className="bg-white even:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">
          {user.username}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.role}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.email}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.accounts.map((account: any, index: any) => (
            <div key={index} className="tag-style">
              {account.provider}
            </div>
          ))}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium  ">
          <div className="flex items-center space-x-2">
            <input
              className="form-checkbox"
              type="checkbox"
              onChange={(e) => handleChange(e, user.email)}
            />

            <form onSubmit={handleUpdateUser} className="flex items-center">
              <select
                name="userRoleSelect"
                className="py-2 px-4 mr-4 bg-white text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="py-2 px-4 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Submit
              </button>
            </form>

            <form onSubmit={handleDeleteUser} className="flex items-center">
              <button
                type="submit"
                className="py-2 px-4 mb-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete
              </button>
            </form>
          </div>
        </td>
      </tr>
    </>
  );
}
