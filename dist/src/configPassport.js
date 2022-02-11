"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const app_1 = require("./app");
const User_1 = __importDefault(require("./classes/User"));
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local").Strategy;
module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        // console.log("serialize: ", user.id)
        return done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        // const response = await db.user.findUnique({
        //   where: {
        //     id: id
        //   }
        // })
        // console.log("deserialize: ", id)
        return done(null, id);
    });
    passport.use(new localStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
        const user = yield app_1.db.user.findUnique({
            // Si se encontró un usuario retorna el objeto y si no "null"
            where: {
                username: username,
            },
        });
        if (!user)
            return done(null, false); // no hay error pero no se encontro un usuario
        if (user && user.password) {
            bcrypt_1.default.compare(password, user.password, (err, result) => {
                if (err)
                    throw err;
                if (result === true) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
        }
    })));
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/api/auth/google/callback",
    }, function (accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield app_1.db.user.findUnique({
                    where: {
                        email: profile.emails[0].value,
                    },
                });
                if (user) {
                    // done(null, user);
                    done(null, profile);
                }
                else {
                    let photo = yield axios_1.default.get(profile.photos[0].value, {
                        responseType: "arraybuffer",
                    });
                    let buffer = Buffer.from(photo.data, "utf-8");
                    const newUser = new User_1.default(profile.displayName, profile.id, buffer, profile.emails[0].value, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
                    const user = yield app_1.db.user.create({
                        //@ts-ignore
                        data: newUser,
                    });
                    // done(null, newUser);
                    console.log("google register: ", profile);
                    done(null, profile);
                }
            }
            catch (error) {
                done(error, null);
            }
        });
    }));
};
