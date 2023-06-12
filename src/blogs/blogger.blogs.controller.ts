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
import { BlogDTO, PostForSpecificBlogDTO } from "../input.classes";
import { User } from "../auth/decorators/public.decorator";
import { GettingAllUsersForSuperAdminCommand } from "../users/use-cases/getting-all-users-for-super-admin";
import { CommandBus } from "@nestjs/cqrs";
import { GettingAllBlogsForSpecifiedBloggerCommand } from "./use-cases/getting-all-blogs-for-specified-blogger";




@UseGuards(AuthGuard)

@Controller('/blogger/blogs')
export class BloggerBlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly common: Common,
    private readonly commandBus: CommandBus,
  ) {}



  @Get()
  @HttpCode(200)
  async getAllBlogs(@Query() QueryParams,
                    @User() user ): Promise<PaginatorViewModelType<Blog>> {
    console.log("getting all blogs procedure");
    const userId = user.userId
    return this.commandBus.execute( new GettingAllBlogsForSpecifiedBloggerCommand(QueryParams,userId))
  }
  @Post()
  async createNewBlog(@Body() DTO : BlogDTO,
                      @User() user
                      ): Promise<any> {

    return this.blogsService.createNewBlog(DTO, user);
  }

  @Get(':id/posts')
  @HttpCode(200)
  async getAllPostsForSpecificBlog(@Req() req : Request,
                                   @Res({passthrough : true}) res: Response,
                                   @Query() QueryParams,
                                   @Param('id') blogId) {
    const token = req.headers.authorization
    console.log(token, "accessToken")
    const paginationCriteria: paginationCriteriaType = this.common.getPaginationCriteria(QueryParams);
    const result =  await this.blogsService.getAllPostsForSpecificBlog(paginationCriteria, blogId, token);
    console.log(result)
    if(!result){
      throw new NotFoundException("Blog not found")
    }
    return result

  }
  @Post(':id/posts')
  @HttpCode(201)
  async createPostForSpecificBlog(
    @Body() DTO : PostForSpecificBlogDTO,
    @Param('id') blogId,
    @Res({passthrough : true}) res: Response
  ): Promise<APIPost | void> {
    const result =  await this.blogsService.createPostForSpecificBlog(DTO, blogId);
    if(!result){
      throw new NotFoundException("Blog not found")
    } else {
      return result
    }
  }


  @Get(':id')
  async getBlogById(@Res({passthrough : true}) res: Response,
    @Param('id') id): Promise<any> {
    const result = await  this.blogsService.getBlogById(id);
    if(!result){
      throw new NotFoundException("Blog not found")
    }
    return result
  }


  @Put(':id')
  @HttpCode(204)
  async updateBlogById(@Res({passthrough : true}) res: Response,
                       @Req() req: Request,
                       @Body() DTO : BlogDTO,
                       @User() user,
                       @Param('id') id): Promise<void> {
    const foundBlog = await this.blogsService.getBlogByIdWithBloggerInfo(id)
    if(!foundBlog){
      throw new NotFoundException("Blog not found")
    }
    if (foundBlog.blogOwnerInfo.userId.toString() !== user.userId){
      throw new ForbiddenException("Blog not found")
    }

    const updateResult = await this.blogsService.updateBlogById(DTO, id);

    return

  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Res({passthrough : true}) res: Response,
                       @User() user,
                       @Param('id') id) {

    const foundBlog = await this.blogsService.getBlogByIdWithBloggerInfo(id)
    if(!foundBlog){
      throw new NotFoundException("Blog not found")
    }
    if (foundBlog.blogOwnerInfo.userId.toString() !== user.userId){
      throw new ForbiddenException("Blog not found")
    }

    const deletedBlog = await this.blogsService.deleteBlogById(id);

    return

  }


  @Put('/:blogId/posts/:postId')
  @HttpCode(204)
  async updatePostForSpecificBlogById(@Res({passthrough : true}) res: Response,
                       @Req() req: Request,
                       @Body() DTO : PostForSpecificBlogDTO,
                       @User() user,
                       @Param('blogId') blogId): Promise<void> {
    const foundBlog = await this.blogsService.getBlogByIdWithBloggerInfo(blogId)
    if (foundBlog.blogOwnerInfo.userId.toString() !== user.userId){
      throw new ForbiddenException("Blog not found")
    }

    const updateResult = await this.blogsService.updateBlogById(DTO, blogId);
    if(!updateResult){
      throw new NotFoundException("Blog not found")
    }
    return

  }
  @Delete('/:blogId/posts/:postId')
  @HttpCode(204)
  async deletePostForSpecificBlogById(@Res({passthrough : true}) res: Response,
                       @User() user,
                       @Param('blogId') blogId) {

    const foundBlog = await this.blogsService.getBlogByIdWithBloggerInfo(blogId)
    if (foundBlog.blogOwnerInfo.userId.toString() !== user.userId){
      throw new ForbiddenException("Blog not found")
    }

    const deletedBlog = await this.blogsService.deleteBlogById(blogId);
    if(!deletedBlog){
      throw new NotFoundException("Blog not found")
    }
    return

  }
}
