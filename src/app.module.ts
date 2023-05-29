import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogsSchema } from './mongo/mongooseSchemas';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://simsbury65:incubator@cluster0.vai5lbz.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogsSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
