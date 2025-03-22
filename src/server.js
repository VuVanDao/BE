import express from "express";
// const express = require("express");
const app = express();
const hostName = "localhost";
const port = 8080;
app.get("/", (req, res) => {
  res.send("<h1>Hello world!!!</h1>");
});
app.listen(port, hostName, () => {
  console.log(
    `sever ${hostName} start in port ${port}. link http://${hostName}:${port}`
  );
});
