import express from 'express'

const app = express();

const error = [{error: 'El elemento que quiere acceder no existe!'}]

const products = [
	{
		"id": 1,
		"title": "Elemento1",
		"description": "Este es el elemento1",
		"price": "200$",
		"thumbnail": "Sin imagen",
		"code": "abc1",
		"stock": "25"
	},
	{
		"id": 2,
		"title": "Elemento2",
		"description": "Este es el elemento2",
		"price": "250$",
		"thumbnail": "Sin imagen",
		"code": "abc2",
		"stock": "25"
	},
	{
		"id": 3,
		"title": "Elemento3",
		"description": "Este es el elemento3",
		"price": "300$",
		"thumbnail": "Sin imagen",
		"code": "abc3",
		"stock": "25"
	},
	{
		"id": 4,
		"title": "Elemento4",
		"description": "Este es el elemento4",
		"price": "350$",
		"thumbnail": "Sin imagen",
		"code": "abc4",
		"stock": "25"
	},
	{
		"id": 5,
		"title": "Elemento5",
		"description": "Este es el elemento5",
		"price": "400$",
		"thumbnail": "Sin imagen",
		"code": "abc5",
		"stock": "25"
	},
	{
		"id": 6,
		"title": "Elemento6",
		"description": "Este es el elemento6",
		"price": "450$",
		"thumbnail": "Sin imagen",
		"code": "abc6",
		"stock": "25"
	},
	{
		"id": 7,
		"title": "Elemento7",
		"description": "Este es el elemento7",
		"price": "500$",
		"thumbnail": "Sin imagen",
		"code": "abc7",
		"stock": "25"
	},
	{
		"id": 8,
		"title": "Elemento8",
		"description": "Este es el elemento8",
		"price": "550$",
		"thumbnail": "Sin imagen",
		"code": "abc8",
		"stock": "25"
	},
	{
		"id": 9,
		"title": "Elemento9",
		"description": "Este es el elemento9",
		"price": "600$",
		"thumbnail": "Sin imagen",
		"code": "abc9",
		"stock": "25"
	},
	{
		"id": 10,
		"title": "Elemento10",
		"description": "Este es el elemento10",
		"price": "650$",
		"thumbnail": "Sin imagen",
		"code": "abc10",
		"stock": "25"
	}
]


app.get('/products', (request,response) => 
{
    const limitsProducts = request.query.limit
    if (!limitsProducts) {
        response.send(products)
    }
    else
    {
        response.send(products.slice(0,limitsProducts))
    }
})

app.get('/products/:idProduct', (request,response) => 
{
    const id = request.params.idProduct
    const product = products.find(Element => Element.id == id)
    if(!product) return response.send(error)
    response.send(product)
})





app.listen(8080, () => console.log('Server up'));

