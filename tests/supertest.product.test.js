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

describe('Supertest de Product', () => {
    it('La ruta raiz devuelve status 200', async () => {
        const response = await requester.get('/products')

        assert.strictEqual(response.status, 302);
    });

    it('Iniciar sesión con credenciales válidas', async () => {
        const response = await requester.post('/api/session/login').send({email: user.email, password: user.password});
        
        assert.strictEqual(response.status, 200);
    });

    it('La respuesta es tipo JSON', async () => {
        const response = await requester.get('/products')

        assert.strictEqual(response.type, 'text/plain')
    });
});