// @ts-ignore
import request from "supertest";
import mongoose from "mongoose";
import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import process from "process";
import cookieParser from "cookie-parser";
import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/exception.filter";
import { ArrayContains, isMongoId, useContainer } from "class-validator";
import { BanUserByBloggerDTO, BlogDTO, UserDTO } from "../../src/input.classes";


const authE2eSpec = "Authorization";
const basic = "Basic YWRtaW46cXdlcnR5";
const mongoURI = process.env.MONGO_URL;

describe("TESTING OF CREATING USER AND AUTH", () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe(
        {
          stopAtFirstError: true,
          exceptionFactory: (errors) => {
            const errorsForResponse = [];
            console.log(errors, "ERRORS");

            errors.forEach(e => {
              const constrainedKeys = Object.keys(e.constraints);
              //console.log(constrainedKeys, "constrainedKeys");
              constrainedKeys.forEach((ckey) => {
                errorsForResponse.push({
                  message: e.constraints[ckey],
                  field: e.property
                });
                console.log(errorsForResponse, "errorsForResponse");

              });

            });
            throw new BadRequestException(errorsForResponse);
          }
        }
      )
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();
    server = app.getHttpServer();
  });
  afterAll(async () => {
    await app.close();
  });
  it("create user, login, create blog, create another user and ban user2 for blog", async () => {

    await request(server).delete("/testing/all-data");

    const users = [];
    for (let i = 0; i <= 2; i++) {
      const createUserDto: UserDTO = {
        login: `login${i}`,
        password: "password",
        email: `simsbury65${i}@gmail.com`
      };
      const res = await request(server)
        .post("/sa/users")
        .set(authE2eSpec, basic)
        .send(createUserDto);


      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(String),
        login: createUserDto.login,
        "email": createUserDto.email,
        "createdAt": expect.any(String),
        "banInfo": {
          "banDate": null,
          "banReason": null,
          "isBanned": false
        }
      });
      expect(isMongoId(res.body.id)).toBeTruthy();
      users.push({ ...createUserDto, ...res.body });
    }

    const [user0, user1] = users;

    const loginRes = await request(server)
      .post("/auth/login")
      .send({
        loginOrEmail: user0.login,
        password: user0.password
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toEqual({ accessToken: expect.any(String) });
    const { accessToken } = loginRes.body;

    const createBlogDto: BlogDTO = {
      name : "string",
      description: "stringasdstring",
      websiteUrl : "simsbury65@gmail.com"
    }

    const createdBlogRes = await request(server)
      .post(`/blogger/blogs`)
      .auth(accessToken, {type: 'bearer'})
      .send(createBlogDto)



    expect(createdBlogRes.status).toBe(201)
    expect(createdBlogRes.body).toEqual({
        "createdAt": expect.any(String),
         "description": createBlogDto.description,
         "id": expect.any(String),
         "isMembership": false,
         "name": createBlogDto.name,
         "websiteUrl": createBlogDto.websiteUrl,
    })

    const blogId = createdBlogRes.body.id

    const countOfBannedUsersBeforeBanRes = await request(server)
      .get(`/blogger/users/blog/${blogId}`)
      .auth(accessToken, {type: 'bearer'})
      .expect(200)

    expect(countOfBannedUsersBeforeBanRes.body.items).toHaveLength(0);


    const banUserDto: BanUserByBloggerDTO = {
      "isBanned": true,
      "banReason": "stringstringstringst",
      blogId
    }

    console.log('start ban user for blog');
    await request(server)
      .put(`/blogger/users/${user1.id}/ban`)
      .auth(accessToken, {type: 'bearer'})
      .send(banUserDto)
      .expect(204)

    const countOfBannedUsersAfterBanRes = await request(server)
      .get(`/blogger/users/blog/${blogId}`)
      .auth(accessToken, {type: 'bearer'})
      .expect(200)

    expect(countOfBannedUsersAfterBanRes.body.items).toHaveLength(1);

    const unbanUserDto: BanUserByBloggerDTO = {
      "isBanned": false,
      "banReason": "stringstringstringst",
      blogId
    }

    await request(server)
      .put(`/blogger/users/${user1.id}/ban`)
      .auth(accessToken, {type: 'bearer'})
      .send(unbanUserDto)
      .expect(204)

    const countOfBannedUsersAfterUnbanRes = await request(server)
      .get(`/blogger/users/blog/${blogId}`)
      .auth(accessToken, {type: 'bearer'})
      .expect(200)

    expect(countOfBannedUsersAfterUnbanRes.body.items).toHaveLength(0);

    // const user = await request(server)
    //   .post("/sa/users")
    //   .set(authE2eSpec, basic)
    //   .send({
    //     login: "login",
    //     password: "password",
    //     email: "simsbury65@gmail.com"
    //   })
    //   .expect(201)
    //
    // const secondUser = await request(server)
    //   .post("/sa/users")
    //   .set(authE2eSpec, basic)
    //   .send({
    //     login: "login2",
    //     password: "password2",
    //     email: "simsbury652@gmail.com"
    //   })
    //   .expect(201)
    //
    // const idOfSecondUser = secondUser.body.id
    //
    // expect(user.body).toEqual({
    //   "createdAt": expect.any(String),
    //   "email": "simsbury65@gmail.com",
    //   "id": expect.any(String),
    //   "login": "login",
    //   "banInfo": {
    //     "banDate": null,
    //     "banReason": null,
    //     "isBanned": false,
    //   },
    // })
    //
    // await request(server)
    //   .post("/auth/login")
    //   .send({
    //     loginOrEmail: "login2",
    //     password: "password2",
    //   })
    //   .expect(200)
    //
    // const login = await request(server)
    //   .post("/auth/login")
    //   .send({
    //     loginOrEmail: "login",
    //     password: "password",
    //   })
    //   .expect(200)
    // const accessTokenOfUser = login.body.accessToken
    //
    //
    // const createdBlog = await request(server)
    //   .post(`/blogger/blogs`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .send({
    //     name : "string",
    //     description: "stringstring",
    //     websiteUrl : "simsbury65@gmail.com"
    //   })
    //   .expect(201)
    //
    // expect(createdBlog.body).toEqual({
    //     "createdAt": expect.any(String),
    //      "description": "stringstring",
    //      "id": expect.any(String),
    //      "isMembership": false,
    //      "name": "string",
    //      "websiteUrl": "simsbury65@gmail.com",
    // })
    //
    // await request(server)
    //   .put(`/blogger/users/${idOfSecondUser}/ban`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .send({
    //     "isBanned": true,
    //     "banReason": "stringstringstringst",
    //     "blogId": "string"
    //   })
    //   .expect(400)
    //
    // const banUserByBlogger = await request(server)
    //   .put(`/blogger/users/${idOfSecondUser}/ban`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .send({
    //     "isBanned": true,
    //     "banReason": "stringstringstringst",
    //     "blogId": createdBlog.body.id
    //   })
    //   .expect(204)
    // const allBansForSpecificBlog = await request(server)
    //   .get(`/blogger/users/blog/${createdBlog.body.id}`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .expect(200)
    //
    // //expect(allBansForSpecificBlog.body).toEqual({})
    // const idOfUserToUnban = idOfSecondUser
    // console.log(allBansForSpecificBlog.body, "+++");
    //
    //
    // await request(server)
    //   .put(`/blogger/users/63189b06003380064c4193be/ban`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .send({
    //     "isBanned": true,
    //     "banReason": "stringstringstringst",
    //     "blogId": createdBlog.body.id
    //   })
    //   .expect(404)
    //
    // await request(server)
    //   .get(`/blogger/users/blog/63189b06003380064c4193be`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .expect(404)
    //
    // const allBansForSpecificBlog2 = await request(server)
    //   .get(`/blogger/users/blog/${createdBlog.body.id}`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .expect(200)
    //
    // expect(allBansForSpecificBlog2.body.items).toEqual([{
    //   "banInfo": {
    //     "banDate": expect.any(String),
    //     "banReason": "stringstringstringst",
    //     "isBanned": true
    //   },
    //   "id": idOfUserToUnban,
    //   "login": "login2"
    // }]);
    //
    //
    // await request(server)
    //   .put(`/blogger/users/${idOfUserToUnban}/ban`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .send({
    //     "isBanned": false,
    //     "banReason": "stringstringstringst",
    //     "blogId": createdBlog.body.id
    //   })
    //   .expect(204)
    //
    // const allBansForSpecificBlog3 = await request(server)
    //   .get(`/blogger/users/blog/${createdBlog.body.id}`)
    //   .set("Authorization", `Bearer ${accessTokenOfUser}`)
    //   .expect(200)
    //
    // expect(allBansForSpecificBlog3.body.items).toHaveLength(0);
    //
    //
    //
    //

  }, 10000);

});