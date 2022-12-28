import express from "express";
import 'express-async-errors';
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { siginRouter } from "./routes/sigin";
import { signupRouter } from "./routes/siginup";
import { siginoutRouter } from "./routes/siginout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(siginRouter);
app.use(signupRouter);
app.use(siginoutRouter);

app.all('*', async ()=>{
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});
