import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception.filter";
import { useContainer } from "class-validator";
import * as cookieParser from "cookie-parser";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors();
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
  const config = new DocumentBuilder()
    .setTitle('social-network example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('social-network')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8080);
}
bootstrap();
