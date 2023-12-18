const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../../index');

chai.use(chaiHttp);

describe('User Registration', () => {
    let bcryptHashStub, userSaveStub;

    beforeEach(() => {
        // Mock bcrypt hash function
        bcryptHashStub = sinon.stub(bcrypt, 'hash').resolves('mockHashedPassword');

        // Mock User save method
        userSaveStub = sinon.stub(User.prototype, 'save').resolves();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should register a new user successfully', (done) => {
        const user = {
            username: 'testuser',
            password: 'testpass',
            email: 'test@test.com'
        };

        chai.request(server)
            .post('/api/register')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('user');
                expect(res.body).to.have.property('token');
                expect(res.body.user).to.include({ username: user.username, email: user.email });
                done();
            });
    });
});
