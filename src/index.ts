import { TProduct, TUser } from "./types"

import express, { Request, Response } from 'express';
import { db } from "./database/knex"
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/users', async (req: Request, res: Response) => {
    try {
        // const result = await db.raw(`
        //     SELECT * FROM users;
        // `)
        const result: any = await db("users")
        if (!result[0]) {
            res.status(404)
            throw new Error("Usuários não encontrados");
        }
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/products', async (req: Request, res: Response) => {
    try {
        // const products = await db.raw(`
        //     SELECT * FROM products;
        // `)
        const products = await db(`products`)
        if (!products[0]) {
            res.status(404)
            throw new Error("Produtos não encontrados");
        }
        res.status(200).send(products)
    } catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/products/search', async (req: Request, res: Response) => {
    try {
        const q = (req.query.q);
        if (q !== undefined) {
            if (typeof q !== 'string') {
                res.status(400);
                throw new Error("Query deve ser uma string");
            }
        }

        const result = await db("products").where("name", "like", `${"%" + q + "%"}`)

        if (!result[0]) {
            res.status(404)
            throw new Error("Produto não encontrado");
        }
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
})

app.post('/users', async (req: Request, res: Response) => {
    try {
        const { name, email, password }: TUser = req.body

        if (name === undefined || email === undefined || password === undefined) {
            res.status(400)
            throw new Error("Requisição incompleta");
        } else {
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

        const userExists = await db("users").where({ name: name }).orWhere({ email: email });

        if (userExists[0]) {
            res.status(409)
            throw new Error("Usuário já existe");
        }

        const newUser: TUser = {
            name,
            email,
            password
        }
        await db("users").insert(newUser)

        res.status(201).send('Cadastro realizado com sucesso!')
    } catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado')
        }
    }
})

app.post('/products', async (req: Request, res: Response) => {
    try {
        const { name, price, description, imageUrl, stock }: TProduct = req.body

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
        // if (category !== undefined) {
        //     if (category !== CATEGORIES.ACCESSORIES && category !== CATEGORIES.CLOTHES_AND_SHOES && category !== CATEGORIES.ELETROS) {
        //         res.status(400);
        //         throw new Error("Categria inválida");
        //     }
        // }
        const productExists = await db("products").where({ name: name });
        // const productExists = await db.raw (`
        //     SELECT * FROM products WHERE name = "${name}";
        // `)
        if (productExists[0]) {
            res.status(409)
            throw new Error("Produto já cadastrado");
        }
        const newProduct: TProduct = {
            name,
            price,
            description,
            stock,
            imageUrl
        }
        // products.push(newProduct);
        await db("products").insert(newProduct);
        // await db.raw(`
        //     INSERT INTO products (name, price, description, imageUrl)
        //     VALUES ("${newProduct.name}", "${newProduct.price}", "${newProduct.description}", "${newProduct.imageUrl}");
        // `)
        res.status(201).send('Produto cadastrado com sucesso!');
    } catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado')
        }
    }
})


app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { buyerId, products } = req.body
        // const {buyer, totalPrice}: TPurchase = req.body
        const purchaseId = Math.floor(Date.now() * Math.random()).toString(36);
        let total_price = 0;
        const purchase = {
            id: purchaseId,
            totalPrice: total_price,
            buyer: buyerId,
        };
        await db('purchases').insert(purchase);
        for (const { productId, quantity } of products) {
            const product = await db('products')
                .select('price', 'stock')
                .where({ 'id': productId });
            // .first();
            console.log(product)
            if (!product[0] || product[0].stock < quantity) {
                throw new Error('Produto não encontrado ou sem estoque suficiente');
            }
            const purchaseProduct = {
                purchase_id: purchaseId,
                product_id: productId,
                quantity: quantity,
            };
            await db('purchases_products').insert(purchaseProduct);
            const totalPrice = product[0].price * quantity;
            total_price += totalPrice;
            const newStock = product[0].stock - quantity;
            await db('products')
                .where('id', productId)
                .update({ stock: newStock });
        }
        await db('purchases')
            .where({ 'id': purchaseId })
            .update({ totalPrice: total_price });

        res.status(200).send('Pedido realizado com sucesso')
    } catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado')
        }
    }
})

app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const productExist = await db("products").where({ id: id });
        // const productExist = await db.raw(`
        //     SELECT * FROM products WHERE id = "${id}";
        // `)
        // const result = products.find(product => product.id === id)

        if (!productExist[0]) {
            res.status(404)
            throw new Error("Produto não encontrado");
        }

        res.status(201).send(productExist)

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/users/:id/purchases', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const userExist = await db("users").where({ id: id })
        // const userExist = await db.raw(`
        //     SELECT * FROM users WHERE id = "${id}";
        // `)
        // const result = purchases.filter(purchase => purchase.userId === id)

        if (!userExist[0]) {
            res.status(400);
            throw new Error("Usuário não encontrado");
        }

        const result = await db('purchases').where({ buyer: id })
        // const result = await db.raw(`
        //     SELECT * FROM purchases WHERE buyer = "${id}";
        // `)

        res.status(201).send(result)
    } catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const purchaseExists = await db('purchases').where({ id: id })

        if (purchaseExists[0]) {
            await db('purchases').del().where({ id: id })
            res.status(201).send('Pedido cancelado com sucesso')
        } else {
            res.status(404)
            throw new Error("Pedido não encontrado");
        }

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        // const productIndex = products.findIndex(product => product.id === id)

        const productExists = await db('products').where({ id: id })
        // const productExists = await db.raw(`
        //     SELECT * FROM products WHERE id = "${id}";
        // `)

        if (productExists[0]) {
            await db('products').del().where({ id: id })
            // await db.raw(`
            //     DELETE FROM products WHERE id = "${id}";
            // `)
            res.status(201).send('Produto deletado com sucesso')
        } else {
            res.status(404)
            throw new Error("Produto não encontrado");
        }

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put('/users/:id', async (req: Request, res: Response) => {
    const { newEmail, newPassword } = req.body
    const id = req.params.id;
    // const newEmail = req.body.email as string | undefined;
    // const newPassword = req.body.password as string | undefined;

    if (!id) {
        res.status(400);
        throw new Error("ID não informada");
    }
    const userExists = await db("users").where({ id: id });
    // const userExists = await db.raw(`
    //     SELECT * FROM users WHERE id = "${id}";
    // `)
    // const user = users.find(user => user.id === id);
    if (!userExists[0]) {
        res.status(404);
        throw new Error("Usuário não encontrado");
    }

    if (newEmail != undefined) {
        if (typeof newEmail === "string") { //colocar um regex aqui pra validar o formato email
            await db("users").update({ email: newEmail }).where({ id: id })
            // await db.raw(`
            //     UPDATE users SET email = "${newEmail}" WHERE id = "${id}";
            // `)
        } else {
            res.status(400);
            throw new Error("email inválido");
        }
    }
    if (newPassword != undefined) {
        if (typeof newPassword === "string") { //colocar um regex aqui pra validar o formato email
            await db("users").update({ password: newPassword }).where({ id: id })
            // await db.raw(`
            //     UPDATE users SET password = "${newPassword}" WHERE id = "${id}";
            // `)
        } else {
            res.status(400);
            throw new Error("email inválido");
        }
    }
    // if (user) {
    //     user.email = newEmail || user.email;
    //     user.password = newPassword || user.password;
    // }

    res.status(200).send("Cadastro atualizado com sucesso")
})

app.put('/products/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    // const newName = req.body.name as string | undefined;
    // const newPrice = req.body.price as number | undefined;
    // const newCategory = req.body.category as CATEGORIES | undefined //isso daqui não filtra NADA!!

    const { newName, newPrice, newDescription, newImageUrl, newStock } = req.body;

    if (!id) {
        res.status(400);
        throw new Error("ID não informada");
    }
    const productExists = await db("products").where({ id: id })
    // const productExists = await db.raw(`
    //     SELECT * FROM products WHERE id = "${id}";
    // `)
    // const user = users.find(user => user.id === id);
    if (!productExists[0]) {
        res.status(404);
        throw new Error("Produto não encontrado");
    }
    // const product = products.find(product => product.id === id);
    if (newName != undefined) {
        if (typeof newName === "string") { //colocar um regex aqui pra validar o formato email
            await db('products').update({ name: newName }).where({ id: id })
            // await db.raw(`
            //     UPDATE products SET name = "${newName}" WHERE id = "${id}";
            // `)
        } else {
            res.status(400);
            throw new Error("Nome inválido");
        }
    }
    if (newPrice != undefined) {
        if (typeof newPrice === "number") {
            await db('products').update({ price: newPrice }).where({ id: id })
            // await db.raw(`
            //     UPDATE products SET price = "${newPrice}" WHERE id = "${id}";
            // `)
        } else {
            res.status(400);
            throw new Error("Nome inválido");
        }
    }
    if (newStock != undefined) {
        if (typeof newStock === "number") {
            await db('products').update({ stock: newStock }).where({ id: id })
            // await db.raw(`
            //     UPDATE products SET price = "${newPrice}" WHERE id = "${id}";
            // `)
        } else {
            res.status(400);
            throw new Error("Nome inválido");
        }
    }
    if (newDescription != undefined) {
        if (typeof newDescription === "string") {
            await db('products').update({ description: newDescription }).where({ id: id })
            // await db.raw(`
            //     UPDATE products SET description = "${newDescription}" WHERE id = "${id}";
            // `)
        } else {
            res.status(400);
            throw new Error("Nome inválido");
        }
    }
    if (newImageUrl != undefined) {
        if (typeof newImageUrl === "string") { //colocar um regex aqui pra validar o formato URL
            await db('products').update({ imageUrl: newImageUrl }).where({ id: id })
            // await db.raw(`
            //     UPDATE products SET imageUrl = "${newImageUrl}" WHERE id = "${id}";
            // `)
        } else {
            res.status(400);
            throw new Error("URL inválido");
        }
    }


    // if (product) {
    //     product.name = newName || product.name;
    //     product.price = newPrice || product.price;
    //     product.category = newCategory || product.category
    // }

    res.status(200).send("Produto atualizado com sucesso")
})

app.get('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const purchaseExists = await db("purchases").where({ id: id });

        if (!purchaseExists[0]) {
            res.status(404);
            throw new Error("Compra não encontrada");
        }

        // const purchaseInfo = await db('purchases').where({id: id})
        // console.log(purchaseInfo)
        // const productInfo = await db('purchases_products').where({'purchase_id':id}).innerJoin('products', 'purchase_id', 'products.id')
        const purchaseInfo = await db('purchases')
            .select(
                'purchases.id as purchaseId',
                'purchases.totalPrice',
                'purchases.createdAt',
                'purchases.paid as isPaid',
                'users.id as buyerId',
                'users.email',
                'users.name',
                'products.id',
                'products.name',
                'products.price',
                'products.description',
                'products.imageUrl',
                'purchases_products.quantity'
            )
            .where({ 'purchases.id': id })
            .innerJoin('users', 'purchases.buyer', 'users.id')
            .innerJoin('purchases_products', 'purchases.id', 'purchases_products.purchase_id')
            .innerJoin('products', 'purchases_products.product_id', 'products.id');

        console.log(purchaseInfo)
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
        // console.log(productInfo)
        // // await db('purchases').select('purchases.id as purchase_id').where({id:id}).innerJoin('users', 'purchases.id', 'users.id')
        // const result = {purchaseInfo, productInfo}
        res.status(200).send(purchase)

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

app.get('/allpurchases/', async (req: Request, res: Response) => {
    try {
        const purchaseInfo = await db('purchases')
            .select(
                'purchases.id as purchaseId',
                'purchases.totalPrice',
                'purchases.createdAt',
                'purchases.paid as isPaid',
                'users.id as buyerId',
                'users.email',
                'users.name',
                'products.id',
                'products.name',
                'products.price',
                'products.description',
                'products.imageUrl',
                'purchases_products.quantity'
            )
            .innerJoin('users', 'purchases.buyer', 'users.id')
            .innerJoin('purchases_products', 'purchases.id', 'purchases_products.purchase_id')
            .innerJoin('products', 'purchases_products.product_id', 'products.id');

        // passar por todos os itens do array de objetos gerado acima (purchaseInfo)
        const purchases = purchaseInfo.reduce((acumulado, atual) => {

            //verificar se a ID do pedido já existe no array de pedidos que está sendo construído pelo reduce (acumulado)
            const index = acumulado.findIndex((p: any) => p.purchaseId === atual.purchaseId);

            if (index === -1) { //caso não existe, adicionar o pedido
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
            } else { //se já existir a ID do pedido, eu adiciono somente o produto no array productsList
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
        }, []); //valor inicial do array (acumulado) é um array vazio

        res.status(200).send(purchases)

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});