import {
  createIssue,
  updateIssueStatus,
  getAllIssues,
  getIssuesByUser,
} from "../../services/issueService.js";
import { categorizeIssue } from "../../services/aiService.js";
import Issue from "../../models/Issue.js";

export const issueResolvers = {
  Query: {
    issues: async () => {
      try {
        // get all issues, newest first
        const allIssues = await Issue.find().sort({ createdAt: -1 });

        return allIssues || [];
      } catch (error) {
        console.error("Error fetching issues:", error);
        return []; // fallback to prevent ui crash
      }
    },
  },

  Mutation: {
    createIssue: async (_, { title, description, location }, { user }) => {
      if (!user) throw new Error("Must be logged in to report an issue.");

      try {
        // call to Ai service to categorize issue based on description
        const category = await categorizeIssue(description);

        // save to database
        const newIssue = await Issue.create({
          title,
          description,
          location,
          category,
          userId: user.id,
        });

        return newIssue;
      } catch (error) {
        throw new Error("Failed to create issue: " + error.message);
      }
    },

    updateIssueStatus: async (_, { issueId, status }, { user }) => {
      // authorization check
      if (!user) throw new Error("Must be logged in to update issue status.");
      if (user.role !== "Municipal Staff") {
        throw new Error("Only municipal staff can update issue status.");
      }

      try {
        const updatedIssue = await Issue.findByIdAndUpdate(
          issueId,
          { status },
          { new: true } // return the updated document. not the old one
        );

        if (!updatedIssue) throw new Error("Issue not found.");
        return updatedIssue;
      } catch (error) {
        throw new Error("Failed to update issue status: " + error.message);
      }
    },
  },
};
