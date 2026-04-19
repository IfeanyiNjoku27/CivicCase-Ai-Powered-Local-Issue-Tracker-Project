import {
  createIssue,
  updateIssueStatus,
  getAllIssues,
  getIssuesByUser,
} from "../../services/issueService.js";

export const issueResolvers = {
  Query: {
    issues: () => getAllIssues(),
    myIssues: (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return getIssuesByUser(user.id);
    },
  },

  Mutation: {
    createIssue: (_, args, { user }) => {
      if (!user) throw new Error("Unauthorized");

      return createIssue({
        ...args,
        userId: user.id,
      });
    },

    updateIssueStatus: (_, { issueId, status }) => {
      return updateIssueStatus(issueId, status);
    },
  },
};