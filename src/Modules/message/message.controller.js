import { Router } from "express";
import * as postService from "./message.service.js";
import * as postValidation from "./message.validation.js";
import {authorization, authentication } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";

import {validation} from "../../middleware/validation.middleware.js"

const router = Router();



