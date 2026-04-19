export const typeDefs = `
    # Identitiy and Authentication Types
    type User {
        id: ID!
        name: String!
        email: String!
        role: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    # Queries 
    type Query {
        # Placeholder. Olamilekan, add 'getIssues' here.
        Query: {
    issues: () => getAllIssues(),
    myIssues: (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return getIssuesByUser(user.id);
    },
  },

        # I will add a query for the chat agent here later as well
    }

    # Mutations
    type Mutation {
        register(name: String!, email: String!, password: String!, role: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!

        # Olamilekan, add 'createIssue' and 'updateIssue' mutations here.
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
    }
`;
