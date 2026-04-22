export const typeDefs = `#graphql
    # -----------------------------------------
    # Identity & Auth Types
    # -----------------------------------------
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

    # -----------------------------------------
    #  Issue Types 
    # -----------------------------------------
    type Issue {
        id: ID!
        title: String!
        description: String!
        location: String!
        status: String!
        category: String!
    }

    # -----------------------------------------
    # ROOT QUERIES
    # -----------------------------------------
    type Query {
        # Person B Queries
        issues: [Issue!]!
        myIssues: [Issue!]!

        # Person A Query (I will build this later)
        chatWithAgent(message: String!): String!
    }

    # -----------------------------------------
    # ROOT MUTATIONS
    # -----------------------------------------
    type Mutation {
        # Person A Mutations
        register(name: String!, email: String!, password: String!, role: String): AuthPayload!
        login(email: String!, password: String!): AuthPayload!

        # Person B Mutations
        createIssue(title: String!, description: String!, location: String!): Issue!
        updateIssueStatus(issueId: ID!, status: String!): Issue!
    }
`;