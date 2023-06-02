import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { BlogsService } from "./blogs/blogs.service";
import { BlogsRepository } from "./blogs/blogs.repository";
import * as process from "process";
import {
  APIComment, APILike,
  APIPost,
  Blog,
  BlogsSchema,
  CommentsSchema, LikesSchema,
  PostsSchema,
  User,
  UsersSchema
} from "./mongo/mongooseSchemas";
import { Common } from "./common";
import { BlogsController } from "./blogs/blogs.controller";
import { TestingController } from "./testing/testing.controller";
import { TestingService } from "./testing/testing.service";
import { PostsRepository } from "./posts/posts.repository";
import { UsersRepository } from "./users/users.reposiroty";
import { CommentsRepository } from "./comments/comments.repository";
import { PostsController } from "./posts/posts.controller";
import { PostsService } from "./posts/posts.service";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { AuthModule } from "./auth/auth.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { EmailAdapter } from "./auth/email.adapter";
import { LikeService } from "./likes/likes.service";
import { LikeRepository } from "./likes/likes.repository";
import { CommentsController } from "./comments/comments.controller";
import { CommentsService } from "./comments/comments.service";

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
    }, {
      name: APILike.name,
      schema: LikesSchema
    }])],

  controllers: [AppController, BlogsController, TestingController,
    PostsController, UsersController, AuthController, CommentsController],

  providers: [AppService, BlogsService, PostsService,TestingService, UsersService,AuthService,EmailAdapter, LikeService,
    BlogsRepository, PostsRepository, UsersRepository,CommentsRepository, LikeRepository, CommentsService,
    Common, AuthModule, JwtModule, JwtService]
})
export class AppModule {
}
