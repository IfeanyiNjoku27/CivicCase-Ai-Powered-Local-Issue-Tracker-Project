"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import { useEffect, useState } from "react";

// query
const GET_ISSUES = gql`
  query {
    issues {
      id
      title
      status
      category
    }
  }
`;

// mutation
const UPDATE_ISSUE_STATUS = gql`
  mutation UpdateIssueStatus($issueId: ID!, $status: String!) {
    updateIssueStatus(issueId: $issueId, status: $status) {
      id
      status
    }
  }
`;

export default function IssueList() {
  const { data, loading, error } = useQuery(GET_ISSUES);
  const [updateStatus] = useMutation(UPDATE_ISSUE_STATUS);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // get user role from local storage (set during login)
    const userData = localStorage.getItem("civic_user");
    if (userData) {
      setUserRole(JSON.parse(userData).role);
    }
  }, []);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateStatus({ variables: { issueId, status: newStatus } });
      alert("Issue status updated");
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Helper function for category icons/colors
  const getCategoryStyle = (category) => {
    const styles = {
      Road: "bg-gray-100 text-gray-700 ring-gray-600/20",
      Lighting: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
      Flooding: "bg-blue-50 text-blue-700 ring-blue-600/20",
      Safety: "bg-red-50 text-red-700 ring-red-600/10",
      Waste: "bg-green-50 text-green-700 ring-green-600/20",
      Other: "bg-purple-50 text-purple-700 ring-purple-600/20",
    };
    return styles[category] || styles.Other;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  if (error)
    return (
      <p className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error fetching issues: {error.message}
      </p>
    );
  if (!data?.issues || data.issues.length === 0)
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">
          No issues reported yet in your municipality.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.issues.map((issue) => (
        <div
          key={issue.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
        >
          <div className="p-5 flex-grow">
            <div className="flex justify-between items-start mb-4">
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryStyle(issue.category)}`}
              >
                {issue.category}
              </span>

              {/* Dynamic Status Badge */}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  issue.status === "Resolved"
                    ? "bg-green-100 text-green-800"
                    : issue.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {issue.status}
              </span>
            </div>

            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {issue.title}
            </h3>
          </div>

          {/* Staff Action Footer */}
          {userRole === "Municipal Staff" && (
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Update Status
              </span>
              <select
                value={issue.status}
                onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                className="block w-32 rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
