import fs from 'fs'
import { constrainedMemory } from 'process';

class CartsManager
{
    #carts
    #error
    #format

    constructor(path)
    {
        this.path = path;
        this.#format = 'utf-8';
        this.#carts = [];
        this.#error = undefined
    }

    checkFileCreation = async() => 
    {
        try
        {
            await fs.promises.access(this.path);
        }
        catch(err)
        {
            this.path = './carts.json'
            await fs.promises.writeFile(this.path,JSON.stringify(this.#carts,null,'\t'))
            console.log(`El archivo ${this.path} no esta creado. No hay carrito, nuevo carrito creado.`)
        }
    }

    getCarts = async() =>{
        await this.checkFileCreation()
        this.#carts = JSON.parse(await fs.promises.readFile(this.path,this.#format))
        return this.#carts
    } 

    getCartsById = async(id) => 
    {
        await this.getCarts()
        const cart = this.#carts.find(element => element.id == parseInt(id))
        if (!cart) return 'Not Found'
        return cart
    }

    #generateId = () => (this.#carts.length === 0) ? 1 : this.#carts[this.#carts.length - 1].id + 1

    #validateCarts = (products) => 
    {
        if (products)
            {
                this.#error = undefined
            }
        else
            {
                this.#error = `[${products}]: No hay elementos en la lista.`
                
            }

        return this.#error
    }

    addCart = async() =>
    {
        await this.checkFileCreation()
        try{
            this.#carts = await this.getCarts()
            
            this.#carts.push({id: this.#generateId(),products: []})
            await fs.promises.writeFile(this.path, JSON.stringify(this.#carts,null,'\t'))
        }
        catch(error)
        {
            console.log(`Error: ${error}`)
        }
        
    }

    updateProduct = async(cartID,productID,quantity) =>
    {
        await this.getCarts()
        const cart = await this.getCartsById(cartID)

        if (cart === 'Not Found') 
        {   
            this.#error = `[${cartID}]: No se encontro el cart con esa ID`
        }
        else
        {
            this.#error = undefined
            const index = this.#carts.findIndex((element) => element.id === parseInt(cartID))
            const productIndex = this.#carts[index].products.findIndex((item) => item.productID === parseInt(productID))
            console.log(productIndex)
            if (productIndex != -1) 
            {
                this.#carts[index].products[productIndex] = {productID: parseInt(productID), quantity: this.#carts[index].products[productIndex].quantity + quantity.quantity}
                await fs.promises.writeFile(this.path, JSON.stringify(this.#carts,null,'\t'))
            }
            else
            {
                this.#carts[index].products.push({productID: parseInt(productID), quantity: quantity.quantity})
                await fs.promises.writeFile(this.path, JSON.stringify(this.#carts,null,'\t'))
            }
        }
        return this.#error
    }

    deleteCart = async(id) =>
    {
        const cart = await this.getProductsById(id)
        if (cart === 'Not Found') 
        {
            return this.#error = `[${id}]: No se encontro la ID`
        }
        else
        {
            const product = this.#carts.filter((element) => element.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(product,null,'\t'))
        }
    }
}


const cart = new CartsManager("./carts.json")
export default cart