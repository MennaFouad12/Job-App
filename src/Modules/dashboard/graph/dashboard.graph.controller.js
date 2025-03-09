import { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString } from "graphql";

import * as dashboardService from "./dashboard.graph.service.js"; 
// Define User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    
    email: { type: GraphQLString },
    
  })
});

// Define Company Type
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLID },
    companyName: { type: GraphQLString },
    description: { type: GraphQLString },
    // industry: { type: GraphQLString },
    companyEmail: { type: GraphQLString }
  })
});

// Queries (Fetching Users and Companies)
export const query = {
  allUsers: {
    type: new GraphQLList(UserType),
    description: "Get all users",
    resolve: async () => {
      return await dashboardService.getAllUsers();
    }
    // async () => await UserModel.find({})
  },
  allCompanies: {
    type: new GraphQLList(CompanyType),
    description: "Get all companies",
    resolve: async () => {
      return await dashboardService.getAllCompanies();
    }
    //  async () => await CompanyModel.find({})
  }
};

// Mutations (Optional - add your own mutations)
export const mutation = {
  dummyMutation: {
    type: GraphQLString,
    resolve: () => "Mutation Placeholder"
  }
};
console.log("Query Object:", query);
console.log("Mutation Object:", mutation);
