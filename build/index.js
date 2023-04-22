"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const types_1 = require("./types");
console.log('Olá mundo');
console.log(database_1.users, database_1.products, database_1.purchases);
console.table((0, database_1.createUser)("u003", "beltrano@email.com", "beltrano99"));
(0, database_1.getAllUsers)();
console.table((0, database_1.createProduct)("p004", "Monitor HD", 800, types_1.CATEGORIES.ELETROS));
(0, database_1.getAllProducts)();
console.table((0, database_1.getProductById)("p004"));
console.table((0, database_1.queryProductsByName)("monitor"));
console.table((0, database_1.createPurchase)("u003", "p004", 2, 1600));
console.table((0, database_1.getAllPurchasesFromUserId)("u003"));
//# sourceMappingURL=index.js.map