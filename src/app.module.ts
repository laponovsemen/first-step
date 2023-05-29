import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
/*import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';*/

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://simsbury65:incubator@cluster0.vai5lbz.mongodb.net/?retryWrites=true&w=majority',
    ),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
