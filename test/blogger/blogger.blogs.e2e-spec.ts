// @ts-ignore
import request from "supertest";
import mongoose from "mongoose";
import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import process from "process";
import cookieParser from "cookie-parser";
import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/exception.filter";
import { useContainer } from "class-validator";


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

    app.useGlobalPipes(new ValidationPipe(
        {
          stopAtFirstError: true,
          exceptionFactory: (errors) => {
            const errorsForResponse = []
            console.log(errors , 'ERRORS')

            errors.forEach(e => {
              const constrainedKeys = Object.keys(e.constraints)
              //console.log(constrainedKeys, "constrainedKeys");
              constrainedKeys.forEach((ckey) => {
                errorsForResponse.push({
                  message : e.constraints[ckey],
                  field : e.property
                })
                console.log(errorsForResponse , "errorsForResponse");

              })

            })
            throw new BadRequestException(errorsForResponse);
          }
        }
      )
    )
    app.useGlobalFilters(new HttpExceptionFilter())
    useContainer(app.select(AppModule), {fallbackOnErrors: true})

    await app.init();
    server = app.getHttpServer()
  });
  afterAll(async () => {
    await app.close()
  });
  it("create user, login, create blog, createanother user and ban user2 for blog", async () => {

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

    const secondUser = await request(server)
      .post("/sa/users")
      .set(authE2eSpec, basic)
      .send({
        login: "login2",
        password: "password2",
        email: "simsbury652@gmail.com"
      })
      .expect(201)

    const idOfSecondUser = secondUser.body.id

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

    await request(server)
      .post("/auth/login")
      .send({
        loginOrEmail: "login2",
        password: "password2",
      })
      .expect(200)

    const login = await request(server)
      .post("/auth/login")
      .send({
        loginOrEmail: "login",
        password: "password",
      })
      .expect(200)
    const accessTokenOfUser = login.body.accessToken


    const createdBlog = await request(server)
      .post(`/blogger/blogs`)
      .set("Authorization", `Bearer ${accessTokenOfUser}`)
      .send({
        name : "string",
        description: "stringstring",
        websiteUrl : "simsbury65@gmail.com"
      })
      .expect(201)

    expect(createdBlog.body).toEqual({
        "createdAt": expect.any(String),
         "description": "stringstring",
         "id": expect.any(String),
         "isMembership": false,
         "name": "string",
         "websiteUrl": "simsbury65@gmail.com",
    })

    await request(server)
      .put(`/blogger/users/${idOfSecondUser}/ban`)
      .set("Authorization", `Bearer ${accessTokenOfUser}`)
      .send({
        "isBanned": true,
        "banReason": "stringstringstringst",
        "blogId": "string"
      })
      .expect(400)

    const banUserByBlogger = await request(server)
      .put(`/blogger/users/${idOfSecondUser}/ban`)
      .set("Authorization", `Bearer ${accessTokenOfUser}`)
      .send({
        "isBanned": true,
        "banReason": "stringstringstringst",
        "blogId": createdBlog.body.id
      })
      .expect(204)









  }, 10000)

})