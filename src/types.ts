import { type } from "os"

// tipagens para cada uma das entidades acima
export type TUser = { 
	name: string, 
	email: string,
    password: string
}

export type TProduct = {
    name: string,
    price: number,
    description: string,
    stock: number,
    imageUrl: string
}

export type TPurchase = {
    id: string,
    totalPrice: number,
    buyer: string,
}
 
// export type TPurchase = {
//     buyer: string,
//     quantity: number,
//     productId: number
// }
// export type TPurchase = {
//     userId: string,
//     productId: string,
//     quantity: number,
//     totalPrice: number
// }
