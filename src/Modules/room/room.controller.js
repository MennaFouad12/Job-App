import { Router } from "express";
import * as roomService from "./room.service.js";
import * as roomValidation from "./room.validation.js";
import {authorization, authentication } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";

import {validation} from "../../middleware/validation.middleware.js"

const router = Router();



router.post("/", 
   authentication(),
   authorization(["User"]),
   
   validation(roomValidation.createRoomSchema), 
   asyncHandler(roomService.createRoom));

   router.get("/", 
    authentication(),
    authorization(["User"]),
    asyncHandler(roomService.getAllRooms));



    router.delete("/:roomId", 
      authentication(),
      authorization(["User"]),
      
      validation(roomValidation.deleteRoomSchema), 
      asyncHandler(roomService.deleteRoom));



      router.get("/:roomId", 
        authentication(),
        authorization(["User"]),
        validation(roomValidation.getSingleRoomSchema),
        asyncHandler(roomService.getSingleRoom));


        
        
   export default router;