"use client";

import { useQuery, gql } from "@apollo/client";

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

export default function IssueList() {
  const { data, loading } = useQuery(GET_ISSUES);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {data.issues.map((issue) => (
        <div key={issue.id}>
          <h3>{issue.title}</h3>
          <p>{issue.category}</p>
          <p>{issue.status}</p>
        </div>
      ))}
    </div>
  );
}