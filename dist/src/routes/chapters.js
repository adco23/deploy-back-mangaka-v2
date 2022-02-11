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
exports.chaptersRouter = void 0;
const express_1 = require("express");
const app_1 = require("../app");
const Chapter_1 = __importDefault(require("../classes/Chapter"));
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
exports.chaptersRouter = (0, express_1.Router)();
// Creacion de un chapter
exports.chaptersRouter.post("/", upload.fields([
    { name: "portada", maxCount: 1 },
    { name: "chapters", maxCount: 20 },
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, mangaId, price } = req.body;
    let images = [];
    let cover;
    if (req.files) {
        //@ts-ignore
        images = req.files.chapters.map((file) => file.buffer);
        //@ts-ignore
        cover = req.files.portada[0].buffer;
    }
    else {
        return res.status(400).send("Images is required");
    }
    const newChapter = new Chapter_1.default(title, images, cover, Number(price), Number(mangaId));
    try {
        //@ts-ignore
        const chapter = yield app_1.db.chapter.create({ data: newChapter });
        return res.json(chapter);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
}));
//Actualizar las imagenes de un chapter
exports.chaptersRouter.put("/chapter/updateImages/:idChapter", upload.array("chapters", 20), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idChapter } = req.params;
    let images = [];
    if (req.files) {
        //@ts-ignore
        images = req.files.map((file) => file.buffer);
    }
    else {
        return res.status(400).send("Images is required");
    }
    try {
        const chapter = yield app_1.db.chapter.update({
            where: { id: Number(idChapter) },
            //@ts-ignore
            data: { images: images },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
}));
//Actualizacion de la portada de un chapter
exports.chaptersRouter.put("/chapter/updateCover/:idChapter", upload.single("cover"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idChapter } = req.params;
    let coverImage;
    if (req.file) {
        coverImage = req.file.buffer;
    }
    else {
        return res.status(400).send({ message: "Cover is required" });
    }
    try {
        const chapter = yield app_1.db.chapter.update({
            where: { id: Number(idChapter) },
            //@ts-ignore
            data: { coverImage: coverImage },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
}));
//Ruta que intercambia las posiciones de 2 imagenes de un chapter
exports.chaptersRouter.put("/chapter/swapImages/:idChapter", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idChapter } = req.params;
    const { index1, index2 } = req.body;
    try {
        let chapterImages = yield app_1.db.chapter.findUnique({
            where: { id: Number(idChapter) },
            select: {
                images: true,
            },
        });
        if (!chapterImages) {
            return res.status(404).send({ message: "Chapter not found" });
        }
        let images = chapterImages.images;
        [images[index1], images[index2]] = [images[index2], images[index1]];
        yield app_1.db.chapter.update({
            where: { id: Number(idChapter) },
            data: { images: images },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
}));
//Traermos un capitulo particularl
exports.chaptersRouter.get("/:idChapter", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idChapter } = req.params;
    console.log(req.params);
    const Manga = yield app_1.db.chapter.findUnique({
        where: { id: Number(idChapter) },
    });
    return res.send(Manga);
}));
//Ruta Test para ver las imagenes de un capitulo
exports.chaptersRouter.get("/chapter/image/:idChapter/:imageIndex", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idChapter, imageIndex } = req.params;
    const chapter = yield app_1.db.chapter.findUnique({
        where: { id: Number(idChapter) },
    });
    res.set("Content-Type", "image/jpeg");
    res.send(chapter.images[imageIndex]);
}));
//Ruta Test para ver la imagen de la portada
exports.chaptersRouter.get("/chapter/cover/:idChapter", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idChapter } = req.params;
    const chapter = yield app_1.db.chapter.findUnique({
        where: { id: Number(idChapter) },
    });
    res.set("Content-Type", "image/jpeg");
    res.send(chapter.coverImage);
}));
// chaptersRouter.post<{}, {}>("/testChapters", async (req, res, next) => {
//   const { title, images, mangaId } = req.body;
//   try {
//   const popularMangas = await db.manga.findMany({})
//   popularMangas.forEach(async manga => {
//     let chapter = new Chapter(`${manga.title} chapter 1`, [`The beginning of ${manga.title}`], manga.id);
//     let chapter2 = new Chapter(`${manga.title} chapter 2`, [`The end of ${manga.title}`], manga.id);
//     let newChapters = await db.chapter.createMany({
//       data: [chapter,chapter2]
//     })
//   })
//     res.status(201).json({message: 'Chapters Created'});
//   } catch (error) {
//     next(new Error(`Chapter Post Error`));
//   }
// });
