import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '../../../graphql/typeDefs.js';
import { authResolvers } from '../../../graphql/resolvers/authResolvers.js';
import connectDB from '../../../lib/db.js';
import jwt from 'jsonwebtoken';

// using array to allow easy addition of more resolvers in the future
const resolvers = [authResolvers];

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
    // context function runs before every graphql query and mutation
    context: async (req) => {
        await connectDB(); // Ensure DB connection for every request
        
        // look for auth header and verify token if it exists
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');

        let user = null;

        // if token exits then verify it and extract user info 
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user = decoded; // contains id and role from auth service
            } catch (error) {
                console.error('Invalid token:', error);
                throw new Error('Invalid or expired token attached to request');
            }
        }
        
        return { req, user }; // Return request and user info in context
    }
});

export { handler as GET, handler as POST };