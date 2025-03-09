import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import companyRouter from "./Modules/company/company.controller.js";
import jobRouter from "./Modules/jobs/job.controller.js";
import appRouter from "./Modules/Apllications/application.controller.js";
import dashboardRouter from "./Modules/dashboard/dashboard.controller.js";
import chatRouter from "./Modules/chat/chat.controller.js";
// import postRouter from "./Modules/Post/post.controller.js";
// import roomRouter from "./Modules/room/room.controller.js";
import "./utils/crone/cronjobs.js"
import connectDB from "./DB/connection.js";
import {
  globalErrorHandler,
  notFoundHabdler,
} from "./utils/error handling/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";


// import morgan from "morgan";

import {rateLimit} from "express-rate-limit"
import helmet from "helmet";
import { GraphQLObjectType,GraphQLSchema,GraphQLString } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import {schema} from "./Modules/app.graph.js";
// console.log(schema)
const bootstarp = async (app, express) => {
  //by default limit 500 req per 5 min
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit:2,//ميعملش لوجن اكتر من مرتين خلال خمس دقايق
    // message: "Too many requests from this IP, please try again after 5 minutes",
    // statusCode: 429,
    handler: (req, res, next,options) => {
      //دول ملهمش علاقه باللي فوق
      return next(new Error(options.message, { cause: options.statusCode }));
    },
    // legacyHeaders: true,//لو عملتها ب فالس مش هترجع الهيدرز مع الريسبونس
    standardHeaders: true,//بترجع حاجات اكتر في الهيدرز
  // skipSuccessfulRequests: true,//هيسكيب حتة الليميت اللي انا عملاها فوق
  // skipFailedRequests: true
  keyGenerator:(req,res,next)=>{
    
  },// by default return req.ip we use it to limit by ip
  skip:(req,res,next)=>{
    return ["127.0.0.1","::1"].includes(req.ip);
//لو انا شغاله باي ip من اللي فوق مش هيعمل ريت ليميت
  }

  });


  await connectDB();

  // const schema=new GraphQLSchema({
  //   query:new GraphQLObjectType({
  //     name:"jobAppQuery",
  //     fields:{hello:{type:GraphQLString,resolve:()=> "hello"}}
  //   })
  // })
  app.use("/graphql", createHandler({schema:schema}));
  // app.use(morgan("combined"));
//   const whiteList = [
//     "http://localhost:4200",
//     "http://localhost:5200",
    
//   ]
//   app.use((req, res, next) => {
//     if (!whiteList.includes(req.headers.origin)) {
// return next(new Error("Blocked by cors", { cause: 401 }));
//     }
//     res.headers("Access-Control-Allow-Origin", req.headers("origin"));
//     req.headers("Access-Control-Allow-Method", "*");
//     req.headers("Access-Control-Allow-Headers", "*");
//     req.headers("Access-Control-Allow-Headers", true);
//     return next();
//   })

app.use(limiter);
app.use(helmet());
  // app.use("/uploads", express.static("uploads"));
  app.use(cors());

  app.use(express.json()); // pasing body

  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.use("/app", appRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/chat", chatRouter);
  // app.use("/post", postRouter);
  // app.use("/comment", postRouter);
  // app.use("/room", roomRouter);

  app.all("*", notFoundHabdler);

  app.use(globalErrorHandler);
};

export default bootstarp;
