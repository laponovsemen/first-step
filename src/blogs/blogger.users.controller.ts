import {
  Body,
  Controller,
  Delete, ForbiddenException,
  Get, HttpCode, HttpStatus, NotFoundException,
  Param,
  Post,
  Put,
  Query, Req, Res, UseGuards
} from "@nestjs/common";
import {
  APIPost,
  APIPostDTO,
  Blog, WithMongoId,
  WithPagination
} from "../mongo/mongooseSchemas";
import { Common } from '../common';
import {
  BlogInsertModelType,
  BlogsPaginationCriteriaType, BlogViewModelType,
  paginationCriteriaType,
  PaginatorViewModelType,
  PostsPaginationCriteriaType
} from "../appTypes";
import express, {Request, Response} from 'express';
import { BlogsService } from './blogs.service';
import { isNotEmpty, IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { AllPostsForSpecificBlogGuard, AuthGuard, BasicAuthGuard } from "../auth/auth.guard";
import { BanUserByBloggerDTO, BlogDTO, PostForSpecificBlogDTO } from "../input.classes";
import { User } from "../auth/decorators/public.decorator";
import { GettingAllUsersForSuperAdminCommand } from "../users/use-cases/getting-all-users-for-super-admin";
import { CommandBus } from "@nestjs/cqrs";
import { GettingAllBlogsForSpecifiedBloggerCommand } from "./use-cases/getting-all-blogs-for-specified-blogger";
import { PostsService } from "../posts/posts.service";
import { BanUserByBloggerCommand } from "./use-cases/ban-user-by-blogger-use-case";
import { GetBannedUsersForSpecificBlogCommand } from "./use-cases/get-banned-users-for-specific-blog-use-case";




@UseGuards(AuthGuard)

@Controller('/blogger')
export class BloggerUsersController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly common: Common,
    private readonly commandBus: CommandBus,
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(AuthGuard)
  @Put("/users/:userIdToBan/ban")
  @HttpCode(204)
  async banUserByBlogger(@Query() QueryParams,
                         @User() user,
                         @Res({passthrough : true}) res : Response,
                         @Body() DTO : BanUserByBloggerDTO,
                         @Param("userIdToBan") userIdToBan): Promise<PaginatorViewModelType<Blog>> {

    console.log("ban user procedure");
    const ownerId = user.userId
    const result = await this.commandBus.execute( new BanUserByBloggerCommand(DTO, userIdToBan, ownerId))
    if(!result){
      throw new NotFoundException()
    } else {
      return
    }

  }

  @UseGuards(AuthGuard)
  @Get("/users/blog/:blogId")
  @HttpCode(200)
  async getBannedUsersForSpecificBlog(
                          @Query() QueryParams,
                          @User() user,
                          @Param("blogId") blogId): Promise<PaginatorViewModelType<Blog>>{
    console.log("getting all banned users for specific blog procedure");
    const userId = user.userId
    return this.commandBus.execute( new GetBannedUsersForSpecificBlogCommand(QueryParams,userId, blogId))
  }

}
