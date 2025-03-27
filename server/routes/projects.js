import express, { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Hello World!");
});
userRouter.post("/", (req, res) => {
  res.send("Hello World!");
});
userRouter.put("/", (req, res) => {
  res.send("Hello World!");
});
userRouter.delete("/", (req, res) => {
  res.send("Hello World!");
});

export default userRouter;
