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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
function paginated(numPaged = 1, order = "asc", tag = "createdAt", filter = []) {
    return __awaiter(this, void 0, void 0, function* () {
        let mangas = [];
        let mangasPerPage = 8;
        let totalMangas = yield app_1.db.manga.count({
            where: {
                genre: {
                    hasEvery: filter,
                },
            },
        });
        let totalPages = Math.ceil(totalMangas / mangasPerPage);
        let page = numPaged;
        if (page > totalPages)
            throw new Error("Page not found");
        let offset = (page - 1) * mangasPerPage;
        try {
            mangas = yield getMangas(mangasPerPage, offset, order, tag, filter);
        }
        catch (e) {
            throw new Error(e.message);
        }
        return [mangas, totalPages, totalMangas];
    });
}
exports.default = paginated;
function getMangas(mangasPerPage, offset, order, tag, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        let mangasPaginated = [];
        try {
            //@ts-ignore
            mangasPaginated = yield app_1.db.manga.findMany({
                take: mangasPerPage,
                skip: offset,
                include: {
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    [tag]: order,
                },
                where: {
                    genre: {
                        hasEvery: filter,
                    },
                },
            });
        }
        catch (e) {
            throw new Error(e.message);
        }
        return mangasPaginated;
    });
}
