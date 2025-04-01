import { expect } from 'chai';
import request from 'supertest';
import { app } from './server.js'; // Import named export

describe('Coupon API', () => {
  let token;
  let server;

  before(async () => {
    server = app.listen(); // Start server for testing
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@demo.com', password: 'pass123' });
    token = res.body.token;
  });

  after(() => {
    server.close(); // Close server after tests
  });

  it('should claim a coupon', async () => {
    const res = await request(app)
      .post('/api/claim')
      .send({ ip: '192.168.1.2' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('code');
  });

  it('should list coupons (admin)', async () => {
    const res = await request(app)
      .get('/api/admin/coupons')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});