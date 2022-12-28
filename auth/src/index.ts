import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { siginRouter } from "./routes/sigin";
import { signupRouter } from "./routes/siginup";
import { siginoutRouter } from "./routes/siginout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
);

app.use(currentUserRouter);
app.use(siginRouter);
app.use(signupRouter);
app.use(siginoutRouter);

app.all('*', async ()=>{
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () =>{
  if (!process.env.JWT_KEY){
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await  mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to Mongodb');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};
start();

