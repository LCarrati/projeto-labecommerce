import { users, products, purchases, createUser, createProduct, createPurchase, getAllUsers, getAllProducts, getProductById, queryProductsByName,getAllPurchasesFromUserId } from "./database"
import { CATEGORIES, TProduct, TPurchase, TUser } from "./types"

import express, { Request, Response} from 'express';
import { db} from "./database/knex"
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/ping', async (req: Request, res: Response) => {
    res.status(200).send('pong')
})

app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
            SELECT * FROM users;
        `)
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
        const products = await db.raw(`
            SELECT * FROM products;
        `)
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
        const q = req.query.q as string;
        if (q !== undefined) {
            if (typeof q !== 'string') {
                res.status(400);
                throw new Error("Query deve ser uma string");
            }
        }
        const result = await db.raw(`
            SELECT * FROM products WHERE products.name LIKE "%${q}%";
        `)
        // const result = products.filter(product => product.name.toLowerCase().includes(q.toLowerCase()))
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
        const {name, email, password}: TUser = req.body

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

        const userExists = await db.raw (`
            SELECT * FROM users WHERE name = "${name}" OR email = "${email}";
        `)
        // const idExists = users.find(user => user.id === id);
        // const emailExists = users.find(user => user.email === email);
        // if (idExists || emailExists) {
        if (userExists[0]) {    
            res.status(409)
            throw new Error("Usuário já existe");
        }

        const newUser: TUser = {
            name,
            email,
            password
        }
        // users.push(newUser)
        await db.raw(`
            INSERT INTO users (name, email, password)
            VALUES ("${newUser.name}", "${newUser.email}", "${newUser.password}");
        `)
        res.status(201).send('Usuário cadastrado com sucesso!')
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
        const {name, price, description, imageUrl }: TProduct = req.body

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
        const productExists = await db.raw (`
            SELECT * FROM products WHERE name = "${name}";
        `)
        if (productExists[0]) {    
            res.status(409)
            throw new Error("Produto já cadastrado");
        }
        const newProduct: TProduct = {
            name,
            price,
            description,
            imageUrl
        }
        // products.push(newProduct);
        await db.raw(`
            INSERT INTO products (name, price, description, imageUrl)
            VALUES ("${newProduct.name}", "${newProduct.price}", "${newProduct.description}", "${newProduct.imageUrl}");
        `)
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

// app.post('/purchases', (req: Request, res: Response) => {
//     try {
//         const {userId, productId, quantity, totalPrice}: TPurchase = req.body

//         if (typeof userId !== 'string'){
//             res.status(400);
//             throw new Error("ID do usuário deve ser uma string");
//         }
//         if (typeof productId !== 'string'){
//             res.status(400);
//             throw new Error("ID do produto deve ser uma string");
//         }
//         if (typeof quantity !== 'number' && quantity > 0){
//             res.status(400);
//             throw new Error("Produto ou quantidade inválidos");
//         }
//         if (typeof totalPrice !== 'number'){
//             res.status(400);
//             throw new Error("Preço inválido");
//         }

//         const userExists = users.find(user => user.id === userId)
//         const productExists = products.find(product => product.id === productId)

//         if (!userExists) {
//             res.status(400);
//             throw new Error("Usuário não encontrado"); 
//         }
//         if (!productExists) {
//             res.status(400);
//             throw new Error("Produto não encontrado"); 
//         }
        
//         const newPurchase: TPurchase = {
//             userId, 
//             productId, 
//             quantity, 
//             totalPrice
//         }
//         purchases.push(newPurchase)
//         res.status(201).send('Compra realizada com sucesso!')
//     } catch (error) {
//         console.log(error);
//         if (res.statusCode === 200) {
//             res.status(500);
//         }
//         if (error instanceof Error) {
//             res.send(error.message);
//         } else {
//             res.send('Erro inesperado')
//         }
//     }
// })

app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const {buyer, totalPrice}: TPurchase = req.body

        if (buyer != undefined) {
            if (typeof buyer !== 'number') {
                res.status(409);
                throw new Error("buyer deve ser uma string");
            }
        }
        if (totalPrice != undefined) {
            if (typeof totalPrice !== 'number') {
                res.status(409);
                throw new Error("totalPrice deve ser um número");
            }
        }

        const buyerExists = await db.raw(`
            SELECT * FROM users WHERE id = "${buyer}";
        `)

        // const userExists = users.find(user => user.id === userId)

        if (!buyerExists[0]) {
            res.status(400);
            throw new Error("Usuário não encontrado"); 
        }
        
        // const newPurchase: TPurchase = {
        //     buyer, 
        //     totalPrice
        // }
        // purchases.push(newPurchase)
        await db.raw(`
            INSERT INTO purchases (buyer, totalPrice) 
            VALUES ("${buyer}", "${totalPrice}");
        `)
        res.status(201).send('Compra realizada com sucesso!')
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
        const productExist = await db.raw(`
            SELECT * FROM products WHERE id = "${id}";
        `)
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
        const userExist = await db.raw(`
            SELECT * FROM users WHERE id = "${id}";
        `)
        // const result = purchases.filter(purchase => purchase.userId === id)
    
        if (!userExist[0]) {
            res.status(400);
            throw new Error("Nada encontrado");
        }
        
        const result = await db.raw(`
            SELECT * FROM purchases WHERE buyer = "${id}";
        `)

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

app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        // const productIndex = products.findIndex(product => product.id === id)

        const productExists = await db.raw(`
            SELECT * FROM products WHERE id = "${id}";
        `)

        if (productExists[0]) {
            await db.raw(`
                DELETE FROM products WHERE id = "${id}";
            `)
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
    const {id, newEmail, newPassword} = req.body
    // const id = req.params.id;
    // const newEmail = req.body.email as string | undefined;
    // const newPassword = req.body.password as string | undefined;

    if (!id) {
        res.status(400);
        throw new Error("ID não informada");
    }
    const userExists = await db.raw(`
        SELECT * FROM users WHERE id = "${id}";
    `)
    // const user = users.find(user => user.id === id);
    if (!userExists[0]) {
        res.status(404);
        throw new Error("Usuário não encontrado");
    }

    if (newEmail != undefined) {
        if (typeof newEmail === "string") { //colocar um regex aqui pra validar o formato email
            await db.raw(`
                UPDATE users SET email = "${newEmail}" WHERE id = "${id}";
            `)
        } else {
            res.status(400);
            throw new Error("email inválido");
        }
    }
    if (newPassword != undefined) {
        if (typeof newPassword === "string") { //colocar um regex aqui pra validar o formato email
            await db.raw(`
                UPDATE users SET password = "${newPassword}" WHERE id = "${id}";
            `)
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
    // const id = req.params.id;
    // const newName = req.body.name as string | undefined;
    // const newPrice = req.body.price as number | undefined;
    // const newCategory = req.body.category as CATEGORIES | undefined //isso daqui não filtra NADA!!

    const {id, newName, newPrice, newDescription, newImageUrl} = req.body;

    if (!id) {
        res.status(400);
        throw new Error("ID não informada");
    }
    const productExists = await db.raw(`
        SELECT * FROM products WHERE id = "${id}";
    `)
    // const user = users.find(user => user.id === id);
    if (!productExists[0]) {
        res.status(404);
        throw new Error("Produto não encontrado");
    }
    // const product = products.find(product => product.id === id);
    if (newName != undefined) {
        if (typeof newName === "string") { //colocar um regex aqui pra validar o formato email
            await db.raw(`
                UPDATE products SET name = "${newName}" WHERE id = "${id}";
            `)
        } else {
            res.status(400);
            throw new Error("Nome inválido");
        }
    }
    if (newPrice != undefined) {
        if (typeof newPrice === "number") {
            await db.raw(`
                UPDATE products SET price = "${newPrice}" WHERE id = "${id}";
            `)
        } else {
            res.status(400);
            throw new Error("Nome inválido");
        }
    }
    if (newDescription != undefined) {
        if (typeof newDescription === "string") {
            await db.raw(`
                UPDATE products SET description = "${newDescription}" WHERE id = "${id}";
            `)
        } else {
            res.status(400);
            throw new Error("Nome inválido");
        }
    }
    if (newImageUrl != undefined) {
        if (typeof newImageUrl === "string") { //colocar um regex aqui pra validar o formato URL
            await db.raw(`
                UPDATE products SET imageUrl = "${newImageUrl}" WHERE id = "${id}";
            `)
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

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});