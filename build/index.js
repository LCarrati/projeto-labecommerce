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
const express_1 = __importDefault(require("express"));
const knex_1 = require("./database/knex");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("users");
        if (!result[0]) {
            res.status(404);
            throw new Error("Usuários não encontrados");
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, knex_1.db)(`products`);
        if (!products[0]) {
            res.status(404);
            throw new Error("Produtos não encontrados");
        }
        res.status(200).send(products);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get('/products/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = (req.query.q);
        if (q !== undefined) {
            if (typeof q !== 'string') {
                res.status(400);
                throw new Error("Query deve ser uma string");
            }
        }
        const result = yield (0, knex_1.db)("products").where("name", "like", `${"%" + q + "%"}`);
        if (!result[0]) {
            res.status(404);
            throw new Error("Produto não encontrado");
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send('Erro inesperado');
        }
    }
}));
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (name === undefined || email === undefined || password === undefined) {
            res.status(400);
            throw new Error("Dados incompletos");
        }
        else {
            if (typeof name !== 'string') {
                res.status(400);
                throw new Error("Nome deve ser uma string");
            }
            if (typeof email !== 'string') {
                res.status(400);
                throw new Error("Email deve ser uma string");
            }
            if (typeof password !== 'string') {
                res.status(400);
                throw new Error("Password deve ser uma string");
            }
        }
        const userExists = yield (0, knex_1.db)("users").where({ name: name }).orWhere({ email: email });
        if (userExists[0]) {
            res.status(409);
            throw new Error("Usuário já existe");
        }
        const newUser = {
            name,
            email,
            password
        };
        yield (0, knex_1.db)("users").insert(newUser);
        res.status(201).send('Cadastro realizado com sucesso!');
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send('Erro inesperado');
        }
    }
}));
app.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, imageUrl, stock } = req.body;
        if (name !== undefined) {
            if (typeof name !== 'string') {
                res.status(400);
                throw new Error("Name deve ser uma string");
            }
        }
        if (price !== undefined) {
            if (typeof price !== 'number') {
                res.status(400);
                throw new Error("Preço deve ser um número");
            }
            if (price < 0) {
                res.status(400);
                throw new Error("Preço deve ser maior ou igual a zero");
            }
        }
        if (stock !== undefined) {
            if (typeof stock !== 'number') {
                res.status(400);
                throw new Error("Estoque deve ser um número");
            }
            if (stock < 0) {
                res.status(400);
                throw new Error("Estoque deve ser maior ou igual a zero");
            }
        }
        if (description !== undefined) {
            if (typeof description !== 'string') {
                res.status(400);
                throw new Error("Description deve ser uma string");
            }
        }
        if (imageUrl !== undefined) {
            if (typeof imageUrl !== 'string') {
                res.status(400);
                throw new Error("imageUrl deve ser uma string");
            }
        }
        const productExists = yield (0, knex_1.db)("products").where({ name: name });
        if (productExists[0]) {
            res.status(409);
            throw new Error("Produto já cadastrado");
        }
        const newProduct = {
            name,
            price,
            description,
            stock,
            imageUrl
        };
        yield (0, knex_1.db)("products").insert(newProduct);
        res.status(201).send('Produto cadastrado com sucesso!');
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send('Erro inesperado');
        }
    }
}));
app.post('/purchases', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { buyerId, products } = req.body;
        const purchaseId = Math.floor(Date.now() * Math.random()).toString(36);
        let total_price = 0;
        const purchase = {
            id: purchaseId,
            totalPrice: total_price,
            buyer: buyerId,
        };
        yield (0, knex_1.db)('purchases').insert(purchase);
        for (const { productId, quantity } of products) {
            const product = yield (0, knex_1.db)('products')
                .select('price', 'stock')
                .where({ 'id': productId });
            console.log(product);
            if (!product[0] || product[0].stock < quantity) {
                throw new Error('Produto não encontrado ou sem estoque suficiente');
            }
            const purchaseProduct = {
                purchase_id: purchaseId,
                product_id: productId,
                quantity: quantity,
            };
            yield (0, knex_1.db)('purchases_products').insert(purchaseProduct);
            const totalPrice = product[0].price * quantity;
            total_price += totalPrice;
            const newStock = product[0].stock - quantity;
            yield (0, knex_1.db)('products')
                .where('id', productId)
                .update({ stock: newStock });
        }
        yield (0, knex_1.db)('purchases')
            .where({ 'id': purchaseId })
            .update({ totalPrice: total_price });
        res.status(200).send('Pedido realizado com sucesso');
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send('Erro inesperado');
        }
    }
}));
app.get('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const productExist = yield (0, knex_1.db)("products").where({ id: id });
        if (!productExist[0]) {
            res.status(404);
            throw new Error("Produto não encontrado");
        }
        res.status(201).send(productExist);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get('/users/:id/purchases', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userExist = yield (0, knex_1.db)("users").where({ id: id });
        if (!userExist[0]) {
            res.status(400);
            throw new Error("Usuário não encontrado");
        }
        const result = yield (0, knex_1.db)('purchases').where({ buyer: id });
        res.status(201).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.delete('/purchases/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const purchaseExists = yield (0, knex_1.db)('purchases').where({ id: id });
        if (purchaseExists[0]) {
            yield (0, knex_1.db)('purchases').del().where({ id: id });
            res.status(201).send('Pedido cancelado com sucesso');
        }
        else {
            res.status(404);
            throw new Error("Pedido não encontrado");
        }
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.delete('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const productExists = yield (0, knex_1.db)('products').where({ id: id });
        if (productExists[0]) {
            yield (0, knex_1.db)('products').del().where({ id: id });
            res.status(201).send('Produto deletado com sucesso');
        }
        else {
            res.status(404);
            throw new Error("Produto não encontrado");
        }
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.put('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newEmail, newPassword } = req.body;
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("ID não informada");
    }
    const userExists = yield (0, knex_1.db)("users").where({ id: id });
    if (!userExists[0]) {
        res.status(404);
        throw new Error("Usuário não encontrado");
    }
    if (newEmail != undefined) {
        if (typeof newEmail === "string") {
            yield (0, knex_1.db)("users").update({ email: newEmail }).where({ id: id });
        }
        else {
            res.status(400);
            throw new Error("email inválido");
        }
    }
    if (newPassword != undefined) {
        if (typeof newPassword === "string") {
            yield (0, knex_1.db)("users").update({ password: newPassword }).where({ id: id });
        }
        else {
            res.status(400);
            throw new Error("email inválido");
        }
    }
    res.status(200).send("Cadastro atualizado com sucesso");
}));
app.put('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { newName, newPrice, newDescription, newImageUrl, newStock } = req.body;
    if (!id) {
        res.status(400);
        throw new Error("ID não informada");
    }
    const productExists = yield (0, knex_1.db)("products").where({ id: id });
    if (!productExists[0]) {
        res.status(404);
        throw new Error("Produto não encontrado");
    }
    if (newName != undefined) {
        if (typeof newName === "string") {
            yield (0, knex_1.db)('products').update({ name: newName }).where({ id: id });
        }
        else {
            res.status(400);
            throw new Error("Nome inválido");
        }
    }
    if (newPrice != undefined) {
        if (typeof newPrice === "number") {
            yield (0, knex_1.db)('products').update({ price: newPrice }).where({ id: id });
        }
        else {
            res.status(400);
            throw new Error("Preço inválido");
        }
    }
    if (newStock != undefined) {
        if (typeof newStock === "number") {
            yield (0, knex_1.db)('products').update({ stock: newStock }).where({ id: id });
        }
        else {
            res.status(400);
            throw new Error("Estoque inválido");
        }
    }
    if (newDescription != undefined) {
        if (typeof newDescription === "string") {
            yield (0, knex_1.db)('products').update({ description: newDescription }).where({ id: id });
        }
        else {
            res.status(400);
            throw new Error("Descrição inválida");
        }
    }
    if (newImageUrl != undefined) {
        if (typeof newImageUrl === "string") {
            yield (0, knex_1.db)('products').update({ imageUrl: newImageUrl }).where({ id: id });
        }
        else {
            res.status(400);
            throw new Error("URL inválido");
        }
    }
    res.status(200).send("Produto atualizado com sucesso");
}));
app.get('/purchases/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const purchaseExists = yield (0, knex_1.db)("purchases").where({ id: id });
        if (!purchaseExists[0]) {
            res.status(404);
            throw new Error("Compra não encontrada");
        }
        const purchaseInfo = yield (0, knex_1.db)('purchases')
            .select('purchases.id as purchaseId', 'purchases.totalPrice', 'purchases.createdAt', 'purchases.paid as isPaid', 'users.id as buyerId', 'users.email', 'users.name', 'products.id', 'products.name', 'products.price', 'products.description', 'products.imageUrl', 'purchases_products.quantity')
            .where({ 'purchases.id': id })
            .innerJoin('users', 'purchases.buyer', 'users.id')
            .innerJoin('purchases_products', 'purchases.id', 'purchases_products.purchase_id')
            .innerJoin('products', 'purchases_products.product_id', 'products.id');
        console.log(purchaseInfo);
        const productsList = purchaseInfo.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            imageUrl: item.imageUrl,
            quantity: item.quantity,
        }));
        const { purchaseId, totalPrice, createdAt, isPaid, buyerId, email } = purchaseInfo[0];
        const purchase = {
            purchaseId,
            totalPrice,
            createdAt,
            isPaid,
            buyerId,
            email,
            productsList,
        };
        res.status(200).send(purchase);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get('/allpurchases/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchaseInfo = yield (0, knex_1.db)('purchases')
            .select('purchases.id as purchaseId', 'purchases.totalPrice', 'purchases.createdAt', 'purchases.paid as isPaid', 'users.id as buyerId', 'users.email', 'users.name', 'products.id', 'products.name', 'products.price', 'products.description', 'products.imageUrl', 'purchases_products.quantity')
            .innerJoin('users', 'purchases.buyer', 'users.id')
            .innerJoin('purchases_products', 'purchases.id', 'purchases_products.purchase_id')
            .innerJoin('products', 'purchases_products.product_id', 'products.id');
        const purchases = purchaseInfo.reduce((acumulado, atual) => {
            const index = acumulado.findIndex((p) => p.purchaseId === atual.purchaseId);
            if (index === -1) {
                acumulado.push({
                    purchaseId: atual.purchaseId,
                    totalPrice: atual.totalPrice,
                    createdAt: atual.createdAt,
                    isPaid: atual.isPaid,
                    buyerId: atual.buyerId,
                    email: atual.email,
                    productsList: [{
                            id: atual.id,
                            name: atual.name,
                            price: atual.price,
                            description: atual.description,
                            imageUrl: atual.imageUrl,
                            quantity: atual.quantity
                        }]
                });
            }
            else {
                acumulado[index].productsList.push({
                    id: atual.id,
                    name: atual.name,
                    price: atual.price,
                    description: atual.description,
                    imageUrl: atual.imageUrl,
                    quantity: atual.quantity
                });
            }
            return acumulado;
        }, []);
        res.status(200).send(purchases);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
//# sourceMappingURL=index.js.map