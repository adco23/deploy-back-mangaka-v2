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
exports.usersRouter = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_1 = require("../app");
const User_1 = __importDefault(require("../classes/User"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 100000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb(new Error("Please upload an image."));
        }
        cb(null, true);
    },
});
const axios_1 = __importDefault(require("axios"));
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield app_1.db.user.findMany({
        where: { created: { some: {} } },
        include: {
            created: true,
        },
    });
    res.send(users);
}));
// Creacion de un user
exports.usersRouter.post("/register", upload.single("avatar"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password, email } = req.body;
    const regPass = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/);
    const regEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!regPass.test(password))
        return res.status(400).json({ error: "Invalid password" });
    if (!regEmail.test(email))
        return res.status(400).json({ error: "Invalid email address" });
    let hashedPassword = yield bcrypt_1.default.hash(password, 10);
    let avatar;
    if (req.file) {
        avatar = req.file.buffer;
    }
    else {
        let bufferImage = yield axios_1.default.get("https://w7.pngwing.com/pngs/896/495/png-transparent-one-punch-man-one-punch-man-volume-3-computer-icons-saitama-one-punch-man-face-manga-head.png", { responseType: "arraybuffer" });
        avatar = Buffer.from(bufferImage.data, "utf-8");
    }
    const newUser = new User_1.default(name, username, avatar, email, hashedPassword);
    try {
        const user = yield app_1.db.user.findFirst({
            where: {
                OR: [{ username: username }, { email: email }],
            },
        });
        if (user) {
            if (user.username === username) {
                return res.status(400).json({ error: "This username already exist" });
            }
            else {
                return res.status(400).json({ error: "This email already exist" });
            }
        }
        yield app_1.db.user.create({
            //@ts-ignore
            data: newUser,
        });
        return res.status(201).json({ msg: "Successefully user created" });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: "An error creating a user" });
    }
}));
exports.usersRouter.put("/user/updateAvatar/:username", upload.single("avatar"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = req.params.username;
    let avatar;
    if (!req.file) {
        return res.status(400).send("Image is required");
    }
    avatar = req.file.buffer;
    try {
        yield app_1.db.user.update({
            where: { username: username },
            //@ts-ignore
            data: { avatar: avatar },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(400).send(error);
    }
}));
//Testea el avatar del usuario
exports.usersRouter.get("/avatar/:username", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { username } = req.params;
    if (!username) {
        return res.status(400).send({ message: "Username is required" });
    }
    const user = yield app_1.db.user.findUnique({
        where: {
            username: username,
        },
    });
    if (user) {
        //Enviar el avatar como respuesta en formato jpeg
        res.setHeader("Content-Type", "image/jpeg");
        //@ts-ignore
        res.send(user.avatar);
    }
    else {
        res.status(404).send("User not found");
    }
}));
// testing autores
exports.usersRouter.post("/authorsTest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let image = yield axios_1.default.get("https://http2.mlstatic.com/D_NQ_NP_781075-MLA48271965969_112021-O.webp", { responseType: "arraybuffer" });
    let buffer = Buffer.from(image.data, "utf-8");
    const userTest2 = new User_1.default("Aster Noriko", "AsterN", buffer, "asternoriko@gmail.com");
    const userTest3 = new User_1.default("Daichi Matsuse", "DaichiM", buffer, "daichimatsuse@gmail.com");
    const userTest4 = new User_1.default("Fumino Hayashi", "FuminoH", buffer, "fuminohayashi@gmail.com");
    const userTest5 = new User_1.default("Gato Aso", "GatoA", buffer, "gatoaso@gmail.com");
    const userTest6 = new User_1.default("Katsu Aki", "KatsuA", buffer, "katsuaki@gmail.com");
    const userTest7 = new User_1.default("Kyo Shirodaira", "KyoS", buffer, "kyoshirodaira@gmail.com");
    const userTest8 = new User_1.default("Mitsuba Takanashi", "MitsubaT", buffer, "mitsubaTakanashi@gmail.com");
    const newUsers = [
        userTest2,
        userTest3,
        userTest4,
        userTest5,
        userTest6,
        userTest7,
        userTest8,
    ];
    try {
        const upsertManyPosts = newUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            return yield app_1.db.user.upsert({
                where: { username: user.username },
                update: {},
                //@ts-ignore
                create: user,
            });
        }));
        const users = yield Promise.all(upsertManyPosts);
        return res.json(users);
    }
    catch (error) {
        console.log(error);
    }
}));
// Ruta de coneccion author y manga.
exports.usersRouter.post("/authorsTest/:username/:idManga", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, idManga } = req.params;
    const getUser = yield app_1.db.user.update({
        where: {
            username: username,
        },
        data: {
            created: {
                connect: { id: Number(idManga) },
            },
        },
    });
    res.json(getUser);
}));
// Perfil de usuario
exports.usersRouter.get("/user/:username", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const User = yield app_1.db.user.findUnique({
        where: { username: username },
        include: {
            created: true,
        },
    });
    return res.send(User);
}));
exports.usersRouter.get("/currentUser", (req, res, next) => {
    // console.log(req)
    // console.log(req.user);
    res.json(req.user);
});
