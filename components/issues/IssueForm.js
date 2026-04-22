"use client";

import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client/core";

const CREATE_ISSUE = gql`
  mutation ($title: String!, $description: String!, $location: String!) {
    createIssue(title: $title, description: $description, location: $location) {
      id
      title
      description
      location
      category
      status
    }
  }
`;

export default function IssueForm() {
  const [createIssue] = useMutation(CREATE_ISSUE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    await createIssue({
      variables: {
        title: form.get("title"),
        description: form.get("description"),
        location: form.get("location"),
        category: form.get("category") || "General",
        status: "Open",
      },
    });

    alert("Issue submitted");
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-100 px-4">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-8 space-y-5"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Report an Issue
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Title
        </label>
        <input
          name="title"
          placeholder="Brief title..."
          required
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Describe the issue in detail..."
          required
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Location
        </label>
        <input
          name="location"
          placeholder="Enter location..."
          required
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-lg font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
      >
        Submit Issue
      </button>
    </form>
  </div>
);
}