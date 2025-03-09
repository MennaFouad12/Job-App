
import { asyncHandler } from "../utils/error handling/asyncHandler.js";
import * as dbService from "../DB/dbService.js";
import { verifyToken } from "../utils/token/token.js";
import { UserModel } from "../DB/Models/user.model.js";
import dotenv from "dotenv";

dotenv.config({ path: '../config/.env' });
export const tokenTypes = {
  access: "access",
  refresh: "refresh",
}




export const decodedToken = async(autherization="",tokenType=tokenTypes.access,next) => {

  console.log(autherization);
  if (!autherization ) {
    return next(new Error("In-valid Token", { cause: 400 }));
  }
  const [bearer, token] = autherization.split(" ");
  if (!bearer ||!token) {
    return next(new Error("In-valid Token", { cause: 400 }));
  }
let ACCESS_SIGNATURE=undefined;
let REFRESH_SIGNATURE=undefined;
switch (bearer) {
  case "User":
    ACCESS_SIGNATURE=process.env.USER_ACCESS_TOKEN;
    REFRESH_SIGNATURE=process.env.USER_REFRESH_TOKEN;
    break;
  case "Admin": 
    ACCESS_SIGNATURE=process.env.ADMIN_ACCESS_TOKEN;
    REFRESH_SIGNATURE=process.env.ADMIN_REFRESH_TOKEN;
    break;
  default:
    break;
}
const decoded = verifyToken({token,signature:tokenTypes.access?ACCESS_SIGNATURE:REFRESH_SIGNATURE});
const user = await dbService.findOne({model:UserModel,filter:{_id:decoded.id,isDeleted:false}});
if(!user){
  return next(new Error("user not found", { cause: 400 }));
}
if(user.changeCredentialsTime>=decoded.iat*1000){
return next(new Error("invalid token", { cause: 400 }));
}
if(!decoded){
  return next(new Error("In-valid Token", { cause: 400 }));

}
return user;
}


export const authentication =() => {
return asyncHandler(async (req, res, next) => {
  const {autherization} = req.headers;
  req.user=await decodedToken(autherization,tokenTypes.access,next);
  return next();
})


};


export const authorization = (roles=[]) => {
return asyncHandler(async (req, res, next) => {
  if(!roles.includes(req.user.role)){
    return next(new Error("Unauthorized", { cause: 401 }));
}
  return next();
}
)

};