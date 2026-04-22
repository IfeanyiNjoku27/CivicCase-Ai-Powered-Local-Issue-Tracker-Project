"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";

// point to next js api route
const httpLink = new HttpLink({
  uri: "/api/graphql",
});

// middleware to add auth token to headers
const authLink = new SetContextLink((_, { headers }) => {
    // get token from local storage
    const token = typeof window !== "undefined" ? localStorage.getItem("civic_token") : null;
    
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
});

// create apollo client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
