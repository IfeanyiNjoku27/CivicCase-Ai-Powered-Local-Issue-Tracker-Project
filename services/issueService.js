import Issue from "../models/Issue.js";
import { categorizeIssue } from "./aiService.js";

export const createIssue = async ({ title, description, location, userId }) => {
  const category = await categorizeIssue(description);

  const issue = new Issue({
    title,
    description,
    location,
    category,
    createdBy: userId,
  });

  await issue.save();
  return issue;
};

export const updateIssueStatus = async (issueId, status) => {
  return await Issue.findByIdAndUpdate(
    issueId,
    { status },
    { new: true }
  );
};

export const getAllIssues = async () => {
  return await Issue.find();
};

export const getIssuesByUser = async (userId) => {
  return await Issue.find({ createdBy: userId });
};