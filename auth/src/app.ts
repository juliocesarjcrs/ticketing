import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { siginRouter } from "./routes/sigin";
import { signupRouter } from "./routes/siginup";
import { siginoutRouter } from "./routes/siginout";
import { errorHandler, NotFoundError } from "@jcrstickets/common";
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
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


export {app};
