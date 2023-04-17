import { users, products, purchases, createUser, createProduct, createPurchase, getAllUsers, getAllProducts, getProductById, queryProductsByName,getAllPurchasesFromUserId } from "./database"
import { CATEGORIES, TProduct, TPurchase, TUser } from "./types"

import express, { Request, Response} from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('pong')
})

app.get('/users', (req: Request, res: Response) => {
    try {
        if (!users) {
            res.status(404)
            throw new Error("Usuários não encontrados");
        }
        res.status(200).send(users)
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

app.get('/products', (req: Request, res: Response) => {
    try {
        if (!products) {
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

app.get('/products/search', (req: Request, res: Response) => {
    try {
        const q = req.query.q as string;
        if (q !== undefined) {
            if (typeof q !== 'string') {
                res.status(400);
                throw new Error("Query deve ser uma string");
            }
        }
        const result = products.filter(product => product.name.toLowerCase().includes(q.toLowerCase()))
        if (!result) {
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

app.post('/users', (req: Request, res: Response) => {
    try {
        const {id, email, password}: TUser = req.body
        // const id = req.body.id;
        // const email = req.body.email;
        // const password = req.body.password;

        if (id === undefined || email === undefined || password === undefined) {
            res.status(400)
            throw new Error("Requisição incompleta");
        } else {
            if (typeof id !== 'string') {
                res.status(400);
                throw new Error("ID deve ser uma string");
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

        const idExists = users.find(user => user.id === id);
        const emailExists = users.find(user => user.email === email);
        if (idExists || emailExists) {
            res.status(409)
            throw new Error("Usuário já existe");
        }

        const newUser: TUser = {
            id,
            email,
            password
        }
        users.push(newUser)
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

app.post('/products', (req: Request, res: Response) => {
    try {
        const {id, name, price, category}: TProduct = req.body
        // const id = req.body.id;
        // const name = req.body.name;
        // const price = req.body.price;
        // const category = req.body.category;

        if (id !== undefined) {
            if (typeof id !== 'string') {
                res.status(400);
                throw new Error("ID deve ser uma string");
            }
        }
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
        if (category !== undefined) {
            if (category !== CATEGORIES.ACCESSORIES && category !== CATEGORIES.CLOTHES_AND_SHOES && category !== CATEGORIES.ELETROS) {
                res.status(400);
                throw new Error("Categria inválida");
            }
        }
        const newProduct: TProduct = {
            id,
            name,
            price,
            category
        }
        products.push(newProduct);
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

app.post('/purchases', (req: Request, res: Response) => {
    try {
        const {userId, productId, quantity, totalPrice}: TPurchase = req.body
        // const userId = req.body.userId;
        // const productId = req.body.productId;
        // const quantity = req.body.quantity;
        // const totalPrice = req.body.totalPrice;

        if (typeof userId !== 'string'){
            res.status(400);
            throw new Error("ID do usuário deve ser uma string");
        }
        if (typeof productId !== 'string'){
            res.status(400);
            throw new Error("ID do produto deve ser uma string");
        }
        if (typeof quantity !== 'number' && quantity > 0){
            res.status(400);
            throw new Error("Produto ou quantidade inválidos");
        }
        if (typeof totalPrice !== 'number'){
            res.status(400);
            throw new Error("Preço inválido");
        }

        const userExists = users.find(user => user.id === userId)
        const productExists = products.find(product => product.id === productId)

        if (!userExists) {
            res.status(400);
            throw new Error("Usuário não encontrado"); 
        }
        if (!productExists) {
            res.status(400);
            throw new Error("Produto não encontrado"); 
        }
        
        const newPurchase: TPurchase = {
            userId, 
            productId, 
            quantity, 
            totalPrice
        }
        purchases.push(newPurchase)
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

app.get('/products/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const result = products.find(product => product.id === id)
        
        if (!result) {
            res.status(404)
            throw new Error("Produto não encontrado");            
        }

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

app.get('/users/:id/purchases', (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const result = purchases.filter(purchase => purchase.userId === id)
    
        if (!result) {
            res.status(400);
            throw new Error("Nada encontrado");
        }
    
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

app.delete('/products/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const productIndex = products.findIndex(product => product.id === id)

        if (productIndex >= 0) {
            products.splice(productIndex, 1);
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

app.put('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const newEmail = req.body.email as string | undefined;
    const newPassword = req.body.password as string | undefined;

    const user = users.find(user => user.id === id);

    if (user) {
        user.email = newEmail || user.email;
        user.password = newPassword || user.password;
    }

    res.status(200).send("Cadastro atualizado com sucesso")
})

app.put('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const newName = req.body.name as string | undefined;
    const newPrice = req.body.price as number | undefined;
    const newCategory = req.body.category as CATEGORIES | undefined //isso daqui não filtra NADA!!

    const product = products.find(product => product.id === id);

    if (product) {
        product.name = newName || product.name;
        product.price = newPrice || product.price;
        product.category = newCategory || product.category
    }

    res.status(200).send("Produto atualizado com sucesso")
})

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});