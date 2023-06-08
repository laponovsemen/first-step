// @ts-ignore
import request from "supertest";
import mongoose from "mongoose";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import process from "process";
import cookieParser from "cookie-parser";


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
    app.use(cookieParser())
    await app.init();
    server = app.getHttpServer()
  });
  afterAll(async () => {
    await app.close()
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

    const token = await request(server)
      .post("/auth/login")
      .send({
        loginOrEmail: "simsbury65@gmail.com",
        password: "password"
      })
      .expect(200)

    expect(token.body.accessToken).toEqual(expect.any(String))

  })
  it("sdfdsfsdfds", async () => {
    await request(server).delete("/testing/all-data")
    const result = await request(server)
      .post("/auth/registration")
      .send({
      email : "igorlaponov01011972@gmail.com",
      login : "string",
      password : "stringstring",
    }).expect(204)
    expect(result.body).toEqual({})


  }, 10000)
  it("sdfdsfsdfds2", async () => {
    const result = await request(server)
      .post("/auth/registration-confirmation")
      .send({"code":"ee751dc0-bd44-41e2-a303-1c8bfade13bd"})
      .expect(400)


  }, 10000)
  it("creating user, login and get my profile", async () => {
    //delete all information
    await request(server).delete("/testing/all-data")
    // create new user
    const creationOfUser = await request(server)
      .post("/users")
      .set(authE2eSpec, basic)
      .send({
        login: "login",
        password: "password",
        email: "simsbury65@gmail.com"
      }).expect(201)
    expect(creationOfUser.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      login: "login",
      email: "simsbury65@gmail.com"})

    // try to login

    const login = await request(server)
      .post("/auth/login")
      .set(authE2eSpec, basic)
      .send({
        loginOrEmail: "login",
        password: "password",
      }).expect(200)
    //expect(login).toEqual({}) // in case to see all incoming information
    const accessToken = login.body.accessToken
    const refreshToken = login.headers["set-cookie"]

    console.log(accessToken, "accessToken")
    console.log(refreshToken, "refreshToken")

    // try to get my profile
    const myProfile = await request(server)
      .get("/auth/me")
      .set(authE2eSpec, `Bearer ${accessToken}`)
      .send({
        loginOrEmail: "login",
        password: "password",
      }).expect(200)

    expect(myProfile.body).toEqual({
      email: expect.any(String),
      login: expect.any(String),
      userId: expect.any(String)
    })

  }, 10000)
  it("creating user, login and try logout", async () => {
    //delete all information
    await request(server).delete("/testing/all-data")
    // create new user
    const creationOfUser = await request(server)
      .post("/users")
      .set(authE2eSpec, basic)
      .send({
        login: "login",
        password: "password",
        email: "simsbury65@gmail.com"
      }).expect(201)
    expect(creationOfUser.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      login: "login",
      email: "simsbury65@gmail.com"})

    // try to login

    const login = await request(server)
      .post("/auth/login")
      .set(authE2eSpec, basic)
      .send({
        loginOrEmail: "login",
        password: "password",
      }).expect(200)
    //expect(login).toEqual({}) // in case to see all incoming information
    const accessToken = login.body.accessToken
    const refreshToken = login.headers["set-cookie"][0]

    console.log(accessToken, "accessToken")
    console.log(refreshToken, "refreshToken")

    // try to logout
    const logoutProcedure = await request(server)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      //.set([{"Cookie", [`refreshToken=${refreshToken}`]},{ authE2eSpec, `Bearer ${accessToken}`}])
      .set("Cookie", [refreshToken])
      .expect(204)
    console.log(new Date(), "new date");
    console.log(new Date().toString(), "new date in string format");
    console.log(new Date().toISOString(), "new date in ISOstring format");
  }, 10000)



})