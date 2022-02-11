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
exports.mangasRouter = void 0;
const express_1 = require("express");
const app_1 = require("../app");
const Manga_1 = __importDefault(require("../classes/Manga"));
const User_1 = __importDefault(require("../classes/User"));
exports.mangasRouter = (0, express_1.Router)();
const axios_1 = __importDefault(require("axios"));
const sorts_1 = require("../utils/sorts");
const paginated_1 = __importDefault(require("../utils/paginated"));
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
// obtiene todos los mangas de la DB y podes recibir por query , el orden (ASC o DESC) y el tags que seria por ejemplo , "tittle" , "chapters" , "rating"
exports.mangasRouter.get("/directory", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, order, tags } = req.query;
    if (!page)
        page = "1";
    let filter = req.query.filter; //Page number > 0, order emun [asc, desc],
    // tags enum [title, chapter, rating, createdAt, updatedAt]
    // filter string "Action-Adventure"
    let filterArray = [];
    if (filter)
        filterArray = filter.split("-");
    let mangasResponse;
    try {
        mangasResponse = yield (0, paginated_1.default)(Number(page), order, tags, filterArray);
    }
    catch (e) {
        return res.status(404).send({ message: e.message });
    }
    let paginatedMangas = mangasResponse[0];
    res.json({
        data: mangasResponse[0],
        total: mangasResponse[1],
        totalMangas: mangasResponse[2],
    });
}));
// Obtener los 10 mangas mas populares por rating
exports.mangasRouter.get("/popularMangas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularMangas = yield app_1.db.manga.findMany({
            where: {
                rating: {
                    gte: 8,
                },
            },
            orderBy: {
                rating: "desc",
            },
            take: 10,
        });
        return res.json({ data: popularMangas });
    }
    catch (err) {
        console.log(err);
    }
}));
// Obtener el detalle de un manga
exports.mangasRouter.get("/manga/:idManga", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idManga } = req.params;
    console.log(req.params);
    const Manga = yield app_1.db.manga.findUnique({
        where: { id: Number(idManga) },
        include: {
            chapters: true,
            author: {
                select: {
                    name: true,
                },
            },
        },
    });
    return res.json({ data: Manga });
}));
// Ruta testing para obtener la imagen del manga
exports.mangasRouter.get("/testImage/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        console.log(req.params);
        const Manga = yield app_1.db.manga.findUnique({
            where: { id: Number(id) },
            include: {
                chapters: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        //Debe devolver la imagen del manga en formato jpeg
        res.setHeader("Content-Type", "image/jpeg");
        //@ts-ignore
        res.send(Manga.image);
    });
});
// Para la creacion de mangas hardcodeamos el usuario para el authorID.
exports.mangasRouter.post("/", upload.single("images"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, synopsis, authorId, genres } = req.body;
    //Las lineas de abajo son para hardcodear el authorId
    const Author = yield app_1.db.user.findUnique({
        where: { username: "SuperAdmin" },
    });
    let image;
    if (req.file) {
        image = req.file.buffer;
    }
    else {
        return res.status(400).send({ message: "Image is required" });
    }
    let createdManga = new Manga_1.default(title, synopsis, image, genres, authorId);
    if (Author) {
        createdManga = new Manga_1.default(title, synopsis, image, genres, Author.id);
    }
    try {
        const newManga = yield app_1.db.manga.create({
            data: createdManga,
        });
        return res.json(newManga);
    }
    catch (error) {
        console.log(error);
        next(new Error(`Manga Post Error`));
    }
}));
exports.mangasRouter.put("/manga/updateCover/:mangaId", upload.single("image"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let image;
    if (req.file) {
        image = req.file.buffer;
    }
    else {
        return res.status(400).send({ message: "Image is required" });
    }
    const { mangaId } = req.params;
    try {
        yield app_1.db.manga.update({
            where: { id: Number(mangaId) },
            //@ts-ignore
            data: { image },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error updating cover" });
    }
}));
// Para borrar todos los  mangas de la DB
exports.mangasRouter.delete("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield app_1.db.manga.deleteMany({});
    res.send("Mangas deleted successfully");
}));
exports.mangasRouter.get("/Search", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.query;
    const result = yield app_1.db.manga.findMany({
        where: {
            title: {
                contains: title,
                mode: "insensitive",
            },
        },
    });
    // let filter = result.filter((e:{}) =>
    //   e.title.toLowerCase().includes(dato.toLowerCase())
    // );
    return res.json({ data: result });
}));
// Ruta de testeo , crea 25 mangas  y un usuario admin como autor y los guarda en la base de datos
exports.mangasRouter.get("/allMangas", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allMangas = yield axios_1.default.get("https://api.jikan.moe/v4/manga?page=2");
    const order = req.query.order;
    const tags = req.query.tags;
    let userDb = yield app_1.db.user.findUnique({ where: { username: "SuperAdmin" } });
    let user;
    if (!userDb) {
        let image = yield axios_1.default.get("https://static.wikia.nocookie.net/memes-pedia/images/0/04/Soy_admin.jpeg/revision/latest?cb=20210127042455&path-prefix=es", { responseType: "arraybuffer" });
        let buffer = Buffer.from(image.data, "utf-8");
        const adminTest = new User_1.default("Admin", "SuperAdmin", buffer, "soyeladmin@gmail.com");
        user = yield app_1.db.user.create({
            //@ts-ignore
            data: adminTest,
        });
    }
    else {
        user = userDb;
    }
    allMangas.data.data.forEach((manga) => __awaiter(void 0, void 0, void 0, function* () {
        let genre = [];
        manga.genres.map((tag) => {
            genre.push(tag.name);
        });
        console.log(manga.images.jpg.image_url);
        let image = yield axios_1.default.get(manga.images.jpg.image_url, {
            responseType: "arraybuffer",
        });
        let buffer = Buffer.from(image.data, "utf-8");
        const createdManga = new Manga_1.default(manga.title, manga.synopsis, buffer, genre, user.id, manga.scored, manga.chapters);
        try {
            yield app_1.db.manga.upsert({
                where: { title: createdManga.title },
                update: {},
                create: createdManga,
            });
        }
        catch (error) {
            console.log(error);
        }
    }));
    if (order && tags) {
        const mangaOrder = (0, sorts_1.sort)(allMangas.data.data, order.toLowerCase(), tags.toLowerCase());
        return res.json(mangaOrder);
    }
    return res.json(allMangas.data.data);
}));
exports.mangasRouter.get("/recentMangas", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentMangas = yield app_1.db.manga.findMany({
            orderBy: {
                uptadedAt: "desc",
            },
            take: 10,
        });
        return res.json({ data: recentMangas });
    }
    catch (error) {
        console.log("Error recentMangas: ", error);
        next(new Error("recentMangas Error"));
    }
}));
exports.mangasRouter.get("/listOfGenres", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mangas = yield app_1.db.manga.findMany();
    let arrayGenres = [];
    mangas.forEach((manga) => {
        manga.genre.forEach((genre) => arrayGenres.push(genre));
    });
    const deleteDuplicates = new Set(arrayGenres);
    let genres = [...deleteDuplicates];
    res.send(genres);
}));
// Devuelve los mangas según el autor buscado
exports.mangasRouter.get("/byAuthor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author } = req.query;
    const query = author;
    try {
        const searchResults = yield app_1.db.user.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
            },
            select: {
                name: true,
                created: true,
            },
        });
        let mangasByAuthor = [];
        searchResults.forEach((elto) => {
            var _a;
            return (_a = elto.created) === null || _a === void 0 ? void 0 : _a.forEach((manga) => mangasByAuthor.push({
                id: manga.id,
                title: manga.title,
                synopsis: manga.synopsis,
                authorId: manga.authorId,
                image: manga.image,
                createdAt: manga.createdAt,
                uptadedAt: manga.uptadedAt,
                genre: manga.genre,
                rating: manga.rating,
                chapter: manga.chapter,
                state: manga.state,
                author: {
                    name: elto.name,
                },
            }));
        });
        res.json({ data: mangasByAuthor });
    }
    catch (error) {
        console.log("Filter by author error: ", error);
    }
}));
