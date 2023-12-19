const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const crypto = require('crypto');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../../index');
const emailModule = require('../../controllers/userController');

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

describe('User Login', () => {
    let bcryptCompareStub;

    beforeEach(() => {
        // Mock bcrypt compare function
        bcryptCompareStub = sinon.stub(bcrypt, 'compare').resolves(true);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should log in a user successfully', (done) => {
        const user = { password: 'test1234', email: 'honky@gmail.com' };

        chai.request(server)
            .post('/api/login')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('token');
                expect(res.body.message).to.equal('Logged in successfully');
                done();
            });
    });
});

describe('Password Reset Initiation', () => {
    let userFindOneStub, userSaveStub, cryptoStub, emailStub;

    beforeEach(() => {
        userFindOneStub = sinon.stub(User, 'findOne');
        userSaveStub = sinon.stub(User.prototype, 'save');
        cryptoStub = sinon.stub(crypto, 'randomBytes').returns({ toString: () => 'mockResetToken' });
        emailStub = sinon.stub(emailModule, 'sendPasswordResetEmail');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should initiate password reset for existing user', async () => {
        const mockUser = {
            email: 'test@test.com',
            save: async () => {}
        };

        userFindOneStub.resolves(mockUser);

        const res = await chai.request(server)
            .post('/api/reset-password')
            .send({ email: mockUser.email });

        expect(res).to.have.status(200);
        expect(userFindOneStub.calledOnce).to.be.true;
        expect(cryptoStub.calledOnce).to.be.true;
        expect(emailStub.calledOnce).to.be.true;
    });

    it('should return 404 for non-existing user', async () => {
        userFindOneStub.resolves(null);

        const res = await chai.request(server)
            .post('/api/reset-password')
            .send({ email: 'nonexistent@test.com' });

        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('User not found');
    });
});

