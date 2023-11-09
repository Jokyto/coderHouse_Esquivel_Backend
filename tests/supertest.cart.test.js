import supertest from "supertest"
import Assert from "assert"

const requester = supertest('http://localhost:8080')

const assert = Assert.strict

const user = {
    first_name: "Guillermo",
    last_name: "Francella",
    email: 'Elvis_Kertzmann@yahoo.com',
    password: "secret"
}

describe('Supertest CART', () => {

    it('La ruta raiz devuelve status 302', async () => {
        
        const response = await requester.get('/api/carts')

        assert.strictEqual(response.status, 302);
    });

    it('La respuesta es tipo Text plain', async () => {
        const response = await requester.get('/api/carts')

        assert.strictEqual(response.type, 'text/plain')
    });
});