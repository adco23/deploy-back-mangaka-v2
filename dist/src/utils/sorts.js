"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = void 0;
function sort(mangas, order, tag) {
    let sortMangas = [...mangas];
    let typeKey = tag;
    // si type se puede castear a la interface;
    sortMangas.sort(function (a, b) {
        if (a[typeKey] > b[typeKey]) {
            return order === 'asc' ? 1 : -1;
        }
        if (a[typeKey] < b[typeKey]) {
            return order === 'asc' ? -1 : 1;
        }
        return 0;
    });
    return sortMangas;
}
exports.sort = sort;
