//e.g server.js
import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/message", (_, res) => res.send("Hello from express! Blah"));

app.get("/game", (_, res) => res.send("Hewwo from express! Blah"));

app.post("/move", (_, res) => res.send("Heck from express! Blah"));


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
