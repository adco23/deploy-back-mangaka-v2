"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class internalOrder {
    constructor(sellerId, buyerId, productId, id) {
        this.sellerId = sellerId;
        this.buyerId = buyerId;
        this.productId = productId;
        this.id = id || undefined;
    }
}
exports.default = internalOrder;
