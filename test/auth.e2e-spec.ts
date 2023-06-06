// @ts-ignore
import request from "supertest";
import mongoose from "mongoose";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import process from "process";


const authE2eSpec = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'
const mongoURI = process.env.MONGO_URL

describe("TESTING OF CREATING USER AND AUTH", () => {
  let app: INestApplication;
  let server : any
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer()
  });
  afterAll(async () => {
    app.close()
  });
  it("should authorize user //auth is correct", async () => {
    //await request(app).delete("/testing/all-data")
    const user = await request(server)
      .post("/users")
      .set(authE2eSpec, basic)
      .send({
        login: "login",
        password: "password",
        email: "simsbury65@gmail.com"
      })
      .expect(201)
    expect(user.body).toEqual({
      "createdAt": expect.any(String),
      "email": "simsbury65@gmail.com",
      "id": expect.any(String),
      "login": "login"
    })

    const token = await request(app)
      .post("/auth/login")
      .send({
        loginOrEmail: "simsbury65@gmail.com",
        password: "password"
      })
      .expect(200)

    expect(token.body.accessToken).toEqual(expect.any(String))

  })
  it("sdfdsfsdfds", async () => {
    const result = await request(app).post("/auth/registration").send({
      email : "igorlaponov01011972@gmail.com",
      login : "string",
      password : "string",
    }).expect(204)


  }, 10000)
  it("sdfdsfsdfds2", async () => {
    const result = await request(app)
      .post("/auth/registration-confirmation")
      .send({"code":"ee751dc0-bd44-41e2-a303-1c8bfade13bd"})
      .expect(400)


  }, 10000)



})