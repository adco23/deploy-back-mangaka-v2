"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CoinsPackage {
    constructor(value, title, sellprice, buyprice, id) {
        this.value = value;
        this.title = title || "sell operation";
        this.sellprice = sellprice || 7;
        this.buyprice = buyprice || 0;
        this.id = id || undefined;
    }
}
exports.default = CoinsPackage;
