"use client";

import { useMutation, gql } from "@apollo/client";

const CREATE_ISSUE = gql`
  mutation ($title: String!, $description: String!, $location: String!) {
    createIssue(title: $title, description: $description, location: $location) {
      id
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
      },
    });

    alert("Issue submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" required />
      <input name="location" placeholder="Location" required />
      <button type="submit">Submit</button>
    </form>
  );
}