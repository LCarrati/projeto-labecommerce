import { TUser, TProduct, TPurchase, CATEGORIES } from "./types";

export const users: Array<TUser> = [
    {
        id: '001',
        email: 'teste01@teste.com',
        password: '1234'
    },
    {
        id: '002',
        email: 'teste02@teste.com',
        password: '1234'
    }
]

export const products: Array<TProduct> = [
    {
        id: 'prod_001',
        name: 'Mocked product 1',
        price: 10,
        category: CATEGORIES.ELETROS
    },
    {
        id: 'prod_002',
        name: 'Mocked product 2',
        price: 20,
        category: CATEGORIES.CLOTHES_AND_SHOES
    }
]

export const purchases: Array<TPurchase> = [
    {
        userId: '001',
        productId: 'prod_001',
        quantity: 2,
        totalPrice: 20
    },
    {
        userId: '001',
        productId: 'prod_002',
        quantity: 3,
        totalPrice: 60
    }
]


export function createUser(id: string, email: string, password: string): string {
    let userToAdd = {
        id: id,
        email: email,
        password: password
    }
    users.push(userToAdd)
    return "Cadastro realizado com sucesso"
}

export function getAllUsers(): void  {
    console.table(users)
}

export function createProduct(id: string, name: string, price: number, category: CATEGORIES): string {
    products.push({
        id: id,
        name: name,
        price: price,
        category: category
    })
    return "Produto cadastrado com sucesso"
}

export function getAllProducts() :void {
    console.table(products)
}

export function getProductById(id: string)  :Array<TProduct> | undefined {
    const result = products.filter(product => product.id === id)
    return result
}

export function queryProductsByName(q: string) :Array<TProduct> | undefined {
    const result = products.filter(product => product.name.toLowerCase().includes(q.toLowerCase()))
    return result
}

export function createPurchase(userId: string, productId: string, quantity: number, totalPrice: number) :string {
    purchases.push({
        userId: userId,
        productId: productId,
        quantity: quantity,
        totalPrice: totalPrice
    })
    return "Compra realizada com sucesso"
}

export function getAllPurchasesFromUserId(id: string) :Array<TPurchase> {
    const result = purchases.filter(user => user.userId === id)
    return result
}