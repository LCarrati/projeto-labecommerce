// tipagens para cada uma das entidades acima

export enum CATEGORIES {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELETROS = "Eletrônicos"
}

export type TUser = { 
	id: string, 
	email: string,
    password: string
}

export type TProduct = {
    id: string,
    name: string,
    price: number,
    category: CATEGORIES
}
 
export type TPurchase = {
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number
}