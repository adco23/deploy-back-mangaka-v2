"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
exports.authRouter = (0, express_1.Router)();
exports.authRouter.get('/login', (req, res) => {
    res.json({ msg: "login failed" });
});
exports.authRouter.get("/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
exports.authRouter.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), function (req, res) {
    res.redirect("http://localhost:3000"); //front
});
exports.authRouter.post("/local/login", (req, res, next) => {
    passport_1.default.authenticate("local", { failureRedirect: '/login' }, (err, user, info) => {
        if (err)
            throw err;
        if (!user)
            return res.status(404).send("No user exists");
        else {
            req.logIn(user, err => {
                if (err)
                    throw err;
                return res.redirect("http://localhost:3001/api/mangas/directory");
            });
        }
    })(req, res, next);
});
exports.authRouter.get("/logout", (req, res) => {
    // console.log(req);
    if (req.user) {
        // console.log("logout");
        req.logout();
        res.send("Logout success");
    }
    else {
        // console.log("no logout");
        res.status(400).send({ msg: "User not logged in" });
    }
});
