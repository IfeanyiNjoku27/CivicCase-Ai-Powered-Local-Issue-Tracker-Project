"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWidget from "../../../components/chatbot/ChatWidget";

import IssueForm from "../../../components/issues/IssueForm";
import IssueList from "../../../components/dashboard/IssueList";

export default function IssuesDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("civic_token");
    const userData = localStorage.getItem("civic_user");

    if (!token || !userData) {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  if (!user)
    return <div className="p-10 text-center text-black">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-gray-600">Role: {user.role}</p>
          </div>
          
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Olamilekan Issue Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Report a New Issue
            </h2>
            <IssueForm />
          </div>

          {/* Right Column: Olamilekan Issue List */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Active Issues
            </h2>
            <IssueList />
          </div>
        </div>
      </div>

      {/* Ifeanyi AI Chatbot */}
      <ChatWidget />
    </div>
  );
}