"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class externalOrder {
    constructor(adminId, userId, status, productId, id) {
        this.adminId = adminId;
        this.userId = userId;
        this.status = status;
        this.productId = productId;
        this.id = id || undefined;
    }
}
exports.default = externalOrder;
