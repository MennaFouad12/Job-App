import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("newApplication", (data) => {
  console.log("New Application Received:", data);
  alert(`New application for Job ID: ${data.jobId}`);
});
