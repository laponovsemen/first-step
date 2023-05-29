import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import * as process from "process";

@Module({
  imports: [ConfigModule.forRoot(),
  MongooseModule.forRoot(process.env.MONGO_URL)],
  controllers: [AppController,BlogsController],
  providers: [AppService, BlogsService, BlogsRepository],
})
export class AppModule {}
