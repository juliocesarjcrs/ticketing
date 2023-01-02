import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route ahndler listen to /api/tickets for post request', async () =>{
  const reponse = await request(app)
  .post('/api/tickets')
  .send({});
  expect(reponse.status).not.toEqual(404);

});

it('can only be accesed if the user is sign in', async () =>{
  await request(app)
  .post('/api/tickets')
  .send({})
  .expect(401);

});

it('return s astatus other than 401 if the user is sinig in', async () =>{
  const reponse = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({});
  expect(reponse.status).not.toEqual(401);

});

it('returns an error if an invalid title is provided', async () =>{
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title: '', price: 10})
  .expect(400);

});

it('returns an error if an invalid price is provided', async () =>{
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title: 'dsad', price: -10})
  .expect(400);
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title: 'dsad'})
  .expect(400);

});

it('creates a ticket with valid inputs', async () =>{

  let tickets  = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title: 'dsad', price: 10})
  .expect(201);

  tickets  = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(10);

});