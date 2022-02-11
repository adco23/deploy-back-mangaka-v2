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
exports.internalOrderRouter = void 0;
const express_1 = require("express");
const app_1 = require("../app");
const InternalOrder_1 = __importDefault(require("../classes/InternalOrder"));
exports.internalOrderRouter = (0, express_1.Router)();
exports.internalOrderRouter.post("/buyChapter", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sellerId, buyerId, productId } = req.body;
    // let tempSeller = {};
    let buyer = yield app_1.db.user.findUnique({
        where: { id: buyerId },
    });
    let seller = yield app_1.db.user.findUnique({ where: { id: sellerId } });
    let product = yield app_1.db.chapter.findUnique({ where: { id: productId } });
    if (buyer && seller && product) {
        if (buyer.coins - product.price < 0) {
            res.send("Insuficient coins");
        }
        else {
            let iOrder = new InternalOrder_1.default(sellerId, buyerId, productId);
            //@ts-ignore
            const newIorder = yield app_1.db.internalOrder.create({ data: iOrder });
            const updateseller = yield app_1.db.user.update({
                where: {
                    username: seller.username,
                },
                data: {
                    coins: seller.coins + product.price,
                },
            });
            const updatebuyer = yield app_1.db.user.update({
                where: {
                    username: buyer.username,
                },
                data: {
                    coins: buyer.coins - product.price,
                    library: [...buyer.library, productId],
                },
            });
            res.send([newIorder, updateseller, updatebuyer]);
        }
    }
}));
