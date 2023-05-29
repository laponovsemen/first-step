import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import * as process from "process";
import { APIPost, Blog, BlogsSchema, PostsSchema } from "./mongo/mongooseSchemas";
import { Common } from "./common";

@Module({
  imports: [ConfigModule.forRoot(),
  MongooseModule.forRoot(process.env.MONGO_URL),
  MongooseModule.forFeature([{
    name: Blog.name,
    schema : BlogsSchema
  }, {
    name: APIPost.name,
    schema : PostsSchema
  }])],

  controllers: [AppController,BlogsController],
  providers: [AppService, BlogsService, BlogsRepository, Common],
})
export class AppModule {}
