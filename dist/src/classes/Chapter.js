"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRatingChapter = exports.setPoints = exports.setTitle = void 0;
class Chapter {
    constructor(title, images, coverImage, price, mangaId, points, usersId, id) {
        this.title = title;
        this.coverImage = coverImage;
        this.images = images;
        this.price = price;
        this.points = points || 0;
        this.mangaId = mangaId;
        this.usersId = usersId || [];
        this.id = id || undefined;
    }
}
exports.default = Chapter;
// change folder classes
function setTitle(chapter, title) {
    chapter.title = title;
}
exports.setTitle = setTitle;
// export function setImages(chapter: Chapter, images: Buffer): void {
//     chapter.images = [...chapter.images.to, ...images]
// }
// averiguar para guardar tanto el usuario que vota con su valor para despues buscarlo y reemplazar si vota de nuevo.
function setPoints(chapter, points, userId) {
    if (!chapter.usersId.includes(userId)) {
        chapter.points += points;
        chapter.usersId.push(userId);
    }
}
exports.setPoints = setPoints;
function getRatingChapter(chapter) {
    let numbersOfUsers = chapter.usersId.length;
    let mediaRating = chapter.points / numbersOfUsers;
    return mediaRating;
}
exports.getRatingChapter = getRatingChapter;
