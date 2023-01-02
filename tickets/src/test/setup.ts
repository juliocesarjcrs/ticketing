import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from 'supertest';
import { app } from "../app";
import jwt from 'jsonwebtoken';
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

declare global {
    var signin: () => string[];
  }

  global.signin = () => {
    // Build a JWT payload. {id, email}
    const payload = {
        id: 'dasdas',
        email: 'test@test.com'
    };

    // Create ateh JWT
    const token =  jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token};
    // Take JSON and encode it as base64
    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');
    return [`session=${base64}`];
  }