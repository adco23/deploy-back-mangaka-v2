import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import { routes } from "./routes/index";
import cors from "cors";
import passport from "passport";
import passportLocal from "passport-local";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt"
import session from "express-session";
import bodyParser from "body-parser";

export const db = new PrismaClient();

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local").Strategy;

const app = express();

function ignoreFavicon(req:any, res:any, next:any) {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  }
  next();
}

app.use((req:any, res:any, next:any) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors({
//   origin: "*",
//   credentials: true
// }));

app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"))
app.use(passport.initialize());
app.use(passport.session());
require("./configPassport")(passport);

app.use("/api", routes);

app.get('/', (req:any, res:any) => {
  res.send('Welcome!');
})
app.use(ignoreFavicon);

// Error catching endware.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send({ message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
