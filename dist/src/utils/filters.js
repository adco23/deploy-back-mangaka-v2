"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterState = void 0;
// filtro por stado dentro
// filtro por capitulo si está finalizado si es largo 201 en adelante, corto 1 a 100 , mediano 101 a 200
function filterState(mangas, filter, length) {
    let mangasByState = [];
    if (filter === "all") {
        mangasByState = mangas;
    }
    else if (filter === "finished") {
        switch (length) {
            case "short":
                mangasByState = mangas.filter(manga => {
                    return manga.state === "finished" && (manga.chapter && manga.chapter <= 100);
                });
                break;
            case "medium":
                mangasByState = mangas.filter(manga => {
                    return manga.state === "finished" && (manga.chapter && manga.chapter > 100 && manga.chapter <= 200);
                });
                break;
            case "long":
                mangasByState = mangas.filter(manga => {
                    return manga.state === "finished" && (manga.chapter && manga.chapter > 200);
                });
                break;
            default:
                mangasByState = mangas.filter(manga => manga.state === "finished");
                break;
        }
    }
    else {
        mangasByState = mangas.filter(manga => manga.state === filter);
    }
    return mangasByState;
}
exports.filterState = filterState;
