"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWishList = exports.addWishList = exports.removeFavorites = exports.addFavorites = exports.removeLibrary = exports.addLibrary = exports.setCreatorMode = exports.removeCoins = exports.addCoins = exports.setCoins = void 0;
class User {
    constructor(name, username, avatar, email, password, about, coins, creatorMode, library, wishList, favorites, id, googleId) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password || undefined;
        this.avatar = avatar || undefined;
        this.about = about || "This is my Profile!";
        this.coins = coins || 0;
        this.creatorMode = creatorMode || false;
        this.library = library || [];
        this.wishList = wishList || [];
        this.favorites = favorites || [];
        this.id = id || undefined;
        this.googleId = googleId || false;
    }
}
exports.default = User;
function setCoins(user, coins) {
    user.coins = coins;
}
exports.setCoins = setCoins;
function addCoins(user, coins) {
    setCoins(user, user.coins + coins);
}
exports.addCoins = addCoins;
function removeCoins(user, coins) {
    if (!(user.coins >= coins)) {
        throw new Error("Insuficient coins");
    }
    setCoins(user, user.coins - coins);
}
exports.removeCoins = removeCoins;
function setCreatorMode(user, mode) {
    user.creatorMode = mode;
}
exports.setCreatorMode = setCreatorMode;
function addLibrary(user, mangaId) {
    user.library = [...user.library, mangaId];
}
exports.addLibrary = addLibrary;
function removeLibrary(user, mangaId) {
    user.library = user.library.filter((manga) => manga !== mangaId);
}
exports.removeLibrary = removeLibrary;
function addFavorites(user, mangaId) {
    user.favorites = [...user.favorites, mangaId];
}
exports.addFavorites = addFavorites;
function removeFavorites(user, mangaId) {
    user.favorites = user.favorites.filter((manga) => manga !== mangaId);
}
exports.removeFavorites = removeFavorites;
function addWishList(user, mangaId) {
    user.wishList = [...user.wishList, mangaId];
}
exports.addWishList = addWishList;
function removeWishList(user, mangaId) {
    user.wishList = user.wishList.filter((manga) => manga !== mangaId);
}
exports.removeWishList = removeWishList;
/*
export function addCreated(user:User,mangaId:number):void {
    user.created = [...user.created, mangaId];
}

export function removeCreated(user:User,mangaId:number):void {
    user.created = user.created.filter(manga => manga !== mangaId);
}
*/
