import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequesError } from "../errors/bad-resquet-error";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequesError("Invalid credencials 1");
        }
        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );
        if (!passwordsMatch) {
            throw new BadRequesError("Invalid credencials 2");
        }
        try {
          // Generate JWT
          const userJwt = jwt.sign(
              {
                  id: existingUser.id,
                  email: existingUser.email,
              },
              process.env.JWT_KEY!
          );
          // store it on session object
          req.session = { jwt: userJwt };
          res.status(200).send(existingUser);
        } catch (err) {
          console.log(err);
        }
    }
);

export { router as siginRouter };
