import { Router } from "express";
import passport from "passport";
import { CLIENT_URL } from "../utils/constants";
import { db } from "../app";
// require('dotenv').config();

export const authRouter = Router();

export async function isAuthenticated(req: any , res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};


authRouter.get('/login', (req, res) => { 
  res.json({msg: "login failed"}); 
});

authRouter.get( "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get("/google/callback",
  passport.authenticate("google", { successRedirect: CLIENT_URL, failureRedirect: "/login" })
);

authRouter.get("/google/response", async (req: any, res: any) => {  
  console.log("google response: ", req.user);
  if( req.user ) {
    let user = await db.user.findUnique({
      where: {
        id: req.user.id,
      }
    })
    return res.json(user)
  }
  res.send({msg: "usuario no logueado"})
});



authRouter.post<{}, {}>("/local/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { successRedirect: CLIENT_URL, failureRedirect: "/login" },
    (err, user, info) => {
      if (err) throw err;
      if (!user) return res.status(404).send("No user exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          return res.send(user) 
        });
      }
    }
  )(req, res, next);
});


authRouter.get("/logout", (req, res) => {
  // console.log(req);
  if (req.user) {
    // console.log("logout");
    req.logout();
    res.send("Logout success");
  }
  else {
    // console.log("no logout");
    res.status(400).send({msg: "User not logged in"});
  }
});
