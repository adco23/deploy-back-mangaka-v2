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
exports.externalOrderRouter = void 0;
const express_1 = require("express");
const app_1 = require("../app");
const CoinsPackage_1 = __importDefault(require("../classes/CoinsPackage"));
const ExternalOrder_1 = __importDefault(require("../classes/ExternalOrder"));
exports.externalOrderRouter = (0, express_1.Router)();
exports.externalOrderRouter.post("/generatePackages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, value, title, buyprice, sellprice } = req.body;
    let cP = new CoinsPackage_1.default(value, title, sellprice, buyprice, id);
    const newPackage = yield app_1.db.coinsPackage.create({ data: cP });
    res.send("Bundle Coins Created");
}));
exports.externalOrderRouter.post("/buy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { adminId, userId, status, productId } = req.body;
    let buyer = yield app_1.db.user.findUnique({ where: { id: userId } });
    console.log(buyer);
    let packageCoins = yield app_1.db.coinsPackage.findUnique({
        where: { id: productId },
    });
    if (buyer) {
        if (status !== "aproved") {
            res.send("There´s a problem with the transaction");
        }
        else {
            const Eorder = new ExternalOrder_1.default(adminId, userId, status, productId);
            //@ts-ignore
            const newEOrder = yield app_1.db.externalOrder.create({ data: Eorder });
            const updateBuyer = yield app_1.db.user.update({
                where: { username: buyer.username },
                data: {
                    coins: buyer.coins + packageCoins.value,
                },
            });
            res.send("Coins Added");
        }
    }
}));
exports.externalOrderRouter.post("/sell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { adminId, userId, status, value } = req.body;
    let seller = yield app_1.db.user.findUnique({ where: { id: userId } });
    let base = yield app_1.db.coinsPackage.findUnique({ where: { id: 6 } });
    if (seller && base) {
        if (seller.coins - value < 0) {
            res.send("There´s a problem with the transaction");
        }
        else {
            let price = (base === null || base === void 0 ? void 0 : base.sellprice) * value;
            let pack = new CoinsPackage_1.default(value, base.title, price, 0);
            let newcP = yield app_1.db.coinsPackage.create({ data: pack });
            const Eorder = new ExternalOrder_1.default(adminId, userId, status, newcP.id);
            //@ts-ignore
            const newEOrder = yield app_1.db.externalOrder.create({ data: Eorder });
            const updateSeller = yield app_1.db.user.update({
                where: { username: seller.username },
                data: { coins: seller.coins - value },
            });
            res.send("Coins Exchanged");
        }
    }
}));
