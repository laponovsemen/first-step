import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { BlogsService } from "./blogs/blogs.service";
import { BlogsRepository } from "./blogs/blogs.repository";
import * as process from "process";
import {
  APIComment,
  APIPost,
  Blog,
  BlogsSchema,
  CommentsSchema,
  PostsSchema,
  User,
  UsersSchema
} from "./mongo/mongooseSchemas";
import { Common } from "./common";
import { BlogsController } from "./blogs/blogs.controller";
import { testingController } from "./testing/testing.controller";
import { TestingService } from "./testing/testing.service";
import { PostsRepository } from "./posts/posts.repository";
import { UsersRepository } from "./users/users.reposiroty";
import { CommentsRepository } from "./comments/comments.repository";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{
      name: Blog.name,
      schema: BlogsSchema
    }, {
      name: APIPost.name,
      schema: PostsSchema
    }, {
      name: APIComment.name,
      schema: CommentsSchema
    }, {
      name: User.name,
      schema: UsersSchema
    }])],

  controllers: [AppController, BlogsController, testingController],
  providers: [AppService, BlogsService, BlogsRepository, Common, TestingService, PostsRepository, UsersRepository,CommentsRepository]
})
export class AppModule {
}
