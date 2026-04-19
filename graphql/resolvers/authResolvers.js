import { registerUser, loginUser } from "../../services/authService";

export const authResolvers = {
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
