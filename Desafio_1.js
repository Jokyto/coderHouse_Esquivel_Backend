import fs from 'fs'

class ProductManager
{
    #products
    #error
    #format

    constructor(path)
    {
        this.path = path;
        this.#format = 'utf-8';
        this.#products = [];
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
            this.path = './productos.json'
            await fs.promises.writeFile(this.path,JSON.stringify(this.#products,null,'\t'))
            console.log(`El archivo ${this.path} no esta creado.`)
        }
    }

    getProducts = async() =>{
        await this.checkFileCreation()
        this.#products = JSON.parse(await fs.promises.readFile(this.path,this.#format))
        return this.#products
    } 

    getProductsById = async(id) => 
    {
        await this.checkFileCreation()
        const product = this.#products.find(element => element.id === id)
        if (!product) return 'Not Found'
        return product
    }

    #generateId = () => (this.#products.length === 0) ? 1 : this.#products[this.#products.length - 1].id + 1

    #validateProducts = (title, description,price,thumbnail,code,stock) => 
    {
        if (!title || !description || !price || !thumbnail || !code || !stock)
            {
                return this.#error = `[${title}]: Faltan campos`
            }
        else
            {
                const found = this.#products.find(element => element.code === code)
                if (found) this.#error = `[${title}]: codigo repetido`
                else this.#error = undefined
            }
    
    }

    addProduct = async(newProduct) =>
    {
        await this.checkFileCreation()
        try{
            this.#products = await this.getProducts()
            this.#validateProducts(newProduct.title,newProduct.description,newProduct.price,newProduct.thumbnail,newProduct.code,newProduct.stock)
            
            if(this.#error === undefined)
            {
                this.#products.push({id: this.#generateId(),title: newProduct.title,description: newProduct.description,price: newProduct.price,thumbnail: newProduct.thumbnail,code: newProduct.code,stock: newProduct.stock})
                await fs.promises.writeFile(this.path, JSON.stringify(this.#products,null,'\t'))
            }
            else
            {
                console.log(this.#error)
            }
        }
        catch(error)
        {
            console.log(`Error: ${error}`)
        }
        
    }

    updateProduct = async(id,newProduct) =>
    {
        const product = await this.getProductsById(id)
        if (product === 'Not Found') 
        {
            return this.#error = `[${id}]: No se encontro la ID`
        }
        else
        {
            const index = this.#products.findIndex((element) => element.id === product.id)
            this.#products[index] = {id: id, ...newProduct}
            await fs.promises.writeFile(this.path, JSON.stringify(this.#products,null,'\t'))
        }
    }

    deleteProduct = async(id) =>
    {
        const product = await this.getProductsById(id)
        if (product === 'Not Found') 
        {
            return this.#error = `[${id}]: No se encontro la ID`
        }
        else
        {
            const product = this.#products.filter((element) => element.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(product,null,'\t'))
        }
    }
}

// const product = new ProductManager("./productos.json")

// const element1 = {title: "producto prueba",description: "Este es un producto prueba",price: "200$",thumbnail: "Sin imagen",code:"abc123",stock: "25"}
// const pruebaDeUpdate = {title: "update",description: "Prueba update",price: "150$",thumbnail: "Sin imagen",code:"UwU",stock: "25"}

// console.log(await product.getProducts())
// product.addProduct(element1)
// console.log(await product.getProducts())
// console.log(await product.getProductsById(1))
// console.log(await product.updateProduct(1,pruebaDeUpdate))
// console.log(await product.deleteProduct(1))

