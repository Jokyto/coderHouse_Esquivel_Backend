import supertest from "supertest"
import Assert from "assert"
import {faker} from "@faker-js/faker"

const requester = supertest('http://localhost:8080')

const assert = Assert.strict

describe('Supertest de User', () => {
    const email =  faker.internet.email()

    const user = {
        first_name: "Guillermo",
        last_name: "Francella",
        email,
        password: "secret"
    }

    it('Se registra un usuario', async () => {
        const response = await requester.post('/api/session/register').send(user)

        assert.strictEqual(response.status, 200);
    });

    it('Iniciar sesión con credenciales válidas', async () => {
        const response = await requester.post('/api/session/login').send({email: email, password: user.password});
        
        assert.strictEqual(response.status, 200);
    });

    it('Iniciar sesión con credenciales inválidas', async () => {
        const userInvalid = {
            username: "usuario_invalido",
            password: "contraseña_invalida"
        };
        const response = await requester.post('/api/session/login').send(userInvalid);


        assert.strictEqual(response.status, 302);
        assert.strictEqual(response.headers.location, '/login/fail');
    });
});