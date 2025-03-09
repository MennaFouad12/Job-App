export const getAllPosts=async(parent ,args)=>{ 
  
const posts=await dbService.find({model:PostModel,filter:{isDeleted:false}})

return{message:"success",statusCode:200,data:{posts}}
}