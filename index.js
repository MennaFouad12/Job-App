import express from "express";
import bootstarp from "./src/app.controller.js";
import dotenv from "dotenv";

import { initializeSocket } from "./src/utils/socket/socket.js";


const app = express();
dotenv.config({ path: './src/config/.env' });
const port = process.env.PORT || 8000;
const server=app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const io = initializeSocket(server);
await bootstarp(app, express);

