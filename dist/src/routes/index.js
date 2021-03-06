"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const users_1 = require("./users");
const mangas_1 = require("./mangas");
const chapters_1 = require("./chapters");
const auth_1 = require("./auth");
const chapterBuy_1 = require("./chapterBuy");
const coins_1 = require("./coins");
exports.routes = (0, express_1.Router)();
exports.routes.use("/users", users_1.usersRouter);
exports.routes.use("/mangas", mangas_1.mangasRouter);
exports.routes.use("/chapters", chapters_1.chaptersRouter);
exports.routes.use("/auth", auth_1.authRouter);
exports.routes.use("/buyChapter", chapterBuy_1.internalOrderRouter);
exports.routes.use("/Coins", coins_1.externalOrderRouter);
