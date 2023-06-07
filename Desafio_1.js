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
        await this.getProducts()
        const product = this.#products.find(element => element.id === parseInt(id))
        if (!product) return 'Not Found'
        return product
    }

    #generateId = () => (this.#products.length === 0) ? 1 : this.#products[this.#products.length - 1].id + 1

    #validateProducts = (title, description,price,thumbnail,code,stock) => 
    {
        if (!title || !description || !price || !thumbnail || !code || !stock)
            {
                if (!title) 
                {
                    return this.#error = `[${title}]: Falta Title`
                }
                if (!description) 
                {
                    return this.#error = `[${title}]: Falta Description`
                }
                if (!price) 
                {
                    return this.#error = `[${title}]: Falta Price`
                }
                if (!thumbnail) 
                {
                    return this.#error = `[${title}]: Falta Thumbnail`
                }
                if (!code) 
                {
                    return this.#error = `[${title}]: Falta Code`
                }
                if (!stock) 
                {
                    return this.#error = `[${title}]: Falta Stock`
                }
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
            this.#error = `[${id}]: No se encontro la ID`
            return console.log(this.#error)
        }
        else
        {
            const index = this.#products.findIndex((element) => element.id === product.id)
            this.#products[index] = {...this.#products[index], ...newProduct}
            await fs.promises.writeFile(this.path, JSON.stringify(this.#products,null,'\t'))
        }
        console.log(this.#error)
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
            const product = this.#products.filter((element) => element.id !== parseInt(id))
            await fs.promises.writeFile(this.path, JSON.stringify(product,null,'\t'))
        }
    }
}


const product = new ProductManager("./productos.json")
export default product


// Pruebas

// const element1 = {title: "Elemento1",description: "Este es el elemento1",price: "200$",thumbnail: "Sin imagen",code:"abc1",stock: "25"}
// const element2 = {title: "Elemento2",description: "Este es el elemento2",price: "250$",thumbnail: "Sin imagen",code:"abc2",stock: "25"}
// const element3 = {title: "Elemento3",description: "Este es el elemento3",price: "300$",thumbnail: "Sin imagen",code:"abc3",stock: "25"}
// const element4 = {title: "Elemento4",description: "Este es el elemento4",price: "350$",thumbnail: "Sin imagen",code:"abc4",stock: "25"}
// const element5 = {title: "Elemento5",description: "Este es el elemento5",price: "400$",thumbnail: "Sin imagen",code:"abc5",stock: "25"}
// const element6 = {title: "Elemento6",description: "Este es el elemento6",price: "450$",thumbnail: "Sin imagen",code:"abc6",stock: "25"}
// const element7 = {title: "Elemento7",description: "Este es el elemento7",price: "500$",thumbnail: "Sin imagen",code:"abc7",stock: "25"}
// const element8 = {title: "Elemento8",description: "Este es el elemento8",price: "550$",thumbnail: "Sin imagen",code:"abc8",stock: "25"}
// const element9 = {title: "Elemento9",description: "Este es el elemento9",price: "600$",thumbnail: "Sin imagen",code:"abc9",stock: "25"}
// const element10 = {title: "Elemento10",description: "Este es el elemento10",price: "650$",thumbnail: "Sin imagen",code:"abc10",stock: "25"}

// await product.addProduct(element1)

// await product.addProduct(element2)

// await product.addProduct(element3)

// await product.addProduct(element4)

// await product.addProduct(element5)

// await product.addProduct(element6)

// await product.addProduct(element7)

// await product.addProduct(element8)

// await product.addProduct(element9)

// await product.addProduct(element10)

// console.log(await product.getProducts())


// const pruebaDeUpdate = {title: "update",description: "Prueba update",price: "150$",thumbnail: "Sin imagen",code:"UwU",stock: "25"}
// console.log(await product.getProducts())
// console.log(await product.getProductsById(1))
// console.log(await product.updateProduct(1,pruebaDeUpdate))
// console.log(await product.deleteProduct(1))