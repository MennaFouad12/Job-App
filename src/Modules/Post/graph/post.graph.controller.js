// import { GraphQLInt, GraphQLList, GraphQLObjectType,GraphQLSchema,GraphQLString } from "graphql";
// import * as postService from "./post.query.service.js";

// export const query={

//   getAllPosts:{
//     type: new GraphQLObjectType({
//       name:"getAllPosts",
//       fields:{
//         message:{type:GraphQLString},
//         statusCode:{type:GraphQLInt},
//         data:{
//           type:new GraphQLList (
//           name:"postResponse",
//           fields:()=>({
//             _id:{type:GraphQLString},
//             title:{type:GraphQLString},
//             content:{type:GraphQLString},
//             images:{type:new GraphQLList(new GraphQLObjectType({
//               name:"allimages",
//               fields:()=>({
//                 secure_url:{type:GraphQLString},
//                 public_id:{type:GraphQLString}
//               })
//             }))},
//             createdBy:{type:GraphQLString},
//             deletedBy:{type:GraphQLString},
//             likes:{type:GraphQLString},
//             isDeleted:{type:GraphQLString},
//         })
//       )
//     }
//     },
//     resolve:postService.getAllPosts
//   })
// }
// };
// export const mutation={

//   likePosts:{
//     type:GraphQLString,
//     resolve:(parent ,args)=>{ 
//     return "hello"}}
// };

// import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
// import * as postService from "./post.query.service.js";


// const ImageType = new GraphQLObjectType({
//   name: "Image",
//   fields: () => ({
//     secure_url: { type: GraphQLString },
//     public_id: { type: GraphQLString },
//   }),
// });


// const PostType = new GraphQLObjectType({
//   name: "Post",
//   fields: () => ({
//     _id: { type: GraphQLString },
//     title: { type: GraphQLString },
//     content: { type: GraphQLString },
//     images: { type: new GraphQLList(ImageType) },
//     createdBy: { type: GraphQLString },
//     deletedBy: { type: GraphQLString },
//     likes: { type: GraphQLString },
//     isDeleted: { type: GraphQLString },
//   }),
// });


// const GetAllPostsResponseType = new GraphQLObjectType({
//   name: "GetAllPostsResponse",
//   fields: () => ({
//     message: { type: GraphQLString },
//     statusCode: { type: GraphQLInt },
//     data: { type: new GraphQLList(PostType) },
//   }),
// });

// // export const query = new GraphQLObjectType({
// //   name: "Query",
// //   fields: {
// //     getAllPosts: {
// //       type: GetAllPostsResponseType,
// //       resolve: postService.getAllPosts,
// //     },
// //   },
// // });

// // export const mutation = new GraphQLObjectType({
// //   name: "Mutation",
// //   fields: {
// //     likePosts: {
// //       type: GraphQLString,
// //       resolve: () => "hello",
// //     },
// //   },
// // });
// export const query = {
//   getAllPosts: {
//     type: new GraphQLObjectType({
//       name: "GetAllPostsResponse",
//       fields: () => ({
//         message: { type: GraphQLString },
//         statusCode: { type: GraphQLString },
//         data: { type: new GraphQLList(GraphQLString) }, // Example structure
//       }),
//     }),
//     resolve: postService.getAllPosts,
//   },
// };

// export const mutation = {
//   likePosts: {
//     type: GraphQLString,
//     resolve: () => "hello",
//   },
// };
// console.log("Query Object:", query);
// console.log("Mutation Object:", mutation);

// export const schema = new GraphQLSchema({
//   query,
//   mutation,
// });
   


import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import * as postService from "./post.query.service.js";

const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    images: { type: new GraphQLList(ImageType) },
    createdBy: { type: GraphQLString },
    deletedBy: { type: GraphQLString },
    likes: { type: GraphQLString },
    isDeleted: { type: GraphQLString },
  }),
});

const GetAllPostsResponseType = new GraphQLObjectType({
  name: "GetAllPostsResponse",
  fields: () => ({
    message: { type: GraphQLString },
    statusCode: { type: GraphQLInt },
    data: { type: new GraphQLList(PostType) },
  }),
});

export const query = {
  getAllPosts: {
    type: GetAllPostsResponseType,
    resolve: postService.getAllPosts,
  },
};

export const mutation = {
  likePosts: {
    type: GraphQLString,
    resolve: () => "hello",
  },
};

console.log("Query Object:", query);
console.log("Mutation Object:", mutation);