// @ts-ignore
import request from "supertest";
import mongoose from "mongoose";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import process from "process";
import cookieParser from "cookie-parser";
import { AppModule } from "../../src/app.module";


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
  it("should create user by super admin", async () => {
    await request(server).delete("/testing/all-data")
    const user = await request(server)
      .post("/sa/users")
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
      "login": "login",
      "banInfo": {
        "banDate": null,
        "banReason": null,
        "isBanned": false,
      },
    })

    for(let i = 0; i < 10 ; i++){
      await request(server)
        .post("/sa/users")
        .set(authE2eSpec, basic)
        .send({
          login: `login${i}`,
          password: `password${i}`,
          email: "simsbury65@gmail.com"
        })
    }

    const allUsers = await request(server)
      .get("/sa/users")
      .set(authE2eSpec, basic)



    expect(allUsers.body).toEqual({
      page : 1,
      pageSize : 10,
      pagesCount : 2,
      totalCount : 11,
      items : [
        { banInfo: {banDate: null, banReason: null, isBanned: false, },
        createdAt: expect.any(String),
        email: "simsbury65@gmail.com",
        id: expect.any(String),
        login: "login9", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login8", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login7", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login6", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login5", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login4", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login3", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login2", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login1", },

        {banInfo: {banDate: null, banReason: null, isBanned: false, },
          createdAt: expect.any(String),
          email: "simsbury65@gmail.com",
          id: expect.any(String),
          login: "login0", },
      ],
      } )

    const idOfUserToBan = allUsers.body.items[0].id

    await request(server)
      .put(`/sa/users/${idOfUserToBan}/ban`)
      .send({
        isBanned: true,
        banReason: "stringstringstringst",
      })
      .expect(401)

    const bannedUser = await request(server)
      .put(`/sa/users/${idOfUserToBan}/ban`)
      .set(authE2eSpec, basic)
      .send({
        isBanned: true,
        banReason: "stringstringstringst",
      })
      .expect(204)

    //delete everything
     await request(server).delete("/testing/all-data")

    //create one user
    await request(server)
      .post("/sa/users")
      .set(authE2eSpec, basic)
      .send({
        login: "login",
        password: "password",
        email: "simsbury65@gmail.com"
      })
      .expect(201)

    const result = await request(server)
      .get("/sa/users")
      .set(authE2eSpec, basic)

    const oneUser = result.body.items[0]
    const userId = oneUser.id
    console.log(oneUser , "oneUser");

    const banUser = await request(server)
      .put(`/sa/users/${userId}/ban`)
      .set(authE2eSpec, basic)
      .send({
        isBanned: true,
        banReason: "stringstringstringst",
      })

    const resultAfterBan = await request(server)
      .get("/sa/users")
      .set(authE2eSpec, basic)

    const oneUserAfterBan = resultAfterBan.body.items[0]
    expect(oneUserAfterBan).toEqual({
      id: userId,
      login: 'login',
      email: 'simsbury65@gmail.com',
      createdAt: expect.any(String),
      banInfo: {
        banDate: expect.any(String),
        banReason: 'stringstringstringst',
        isBanned: true
      }
    })
    console.log(oneUserAfterBan, "oneUserAfterBan");

    const unbanUser = await request(server)
      .put(`/sa/users/${userId}/ban`)
      .set(authE2eSpec, basic)
      .send({
        isBanned: false,
        banReason: "stringstringstringst",
      })
    }, 10000)








})