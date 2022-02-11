"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRating = exports.setSynopsis = exports.setTitle = void 0;
var State;
(function (State) {
    State[State["Finished"] = 0] = "Finished";
    State[State["on_going"] = 1] = "on_going";
    State[State["on_pause"] = 2] = "on_pause";
})(State || (State = {}));
class Manga {
    constructor(title, synopsis, image, genre, authorId, rating, chapter, chapters, state, id) {
        this.title = title;
        this.synopsis = synopsis;
        this.image = image;
        this.genre = genre;
        this.rating = rating || 0;
        this.state = state || "on_going";
        this.id = id || undefined;
        this.authorId = authorId;
        this.chapter = chapter || 0;
        this.chapters = chapters || undefined;
    }
}
exports.default = Manga;
function setTitle(manga, title) {
    manga.title = title;
}
exports.setTitle = setTitle;
function setSynopsis(manga, synopsis) {
    manga.synopsis = synopsis;
}
exports.setSynopsis = setSynopsis;
// export function setCover(manga: Manga, coverimage: string): void {
//   manga.images[0] = coverimage;
// }
// export function setBackCover(manga: Manga, backImage: string): void {
//   manga.images[1] = backImage;
// }
function setRating(manga, rating) {
    manga.rating = rating;
}
exports.setRating = setRating;
/*
export function setState(manga: Manga, state: State): void {
    switch (state) {
        case (State.Finished):
            manga.state = State.Finished;
            break;
        case (State.on_going):
            manga.state = State.on_going;
            break;
        case (State.on_pause):
            manga.state = State.on_pause;
            break;
        default:
            break;
    }
}
*/
