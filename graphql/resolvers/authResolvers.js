import { registerUser, loginUser } from "../../services/authService";
import { chatWithAgent } from "../../services/aiService";

export const authResolvers = {
  Query: {
    chatWithAgent: async (_, { message }, { user }) => {
      // optional: you can add authentication check here if you want only logged in users to access the agent
      // if we want to make this public then comment out if statement below
      if (!user)
        throw new Error("Authentication required to chat with the agent.");

      try {
        return await chatWithAgent(message);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    register: async (_, args) => {
      try {
        return await registerUser(args);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    login: async (_, args) => {
      try {
        return await loginUser(args);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
