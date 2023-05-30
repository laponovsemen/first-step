import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpStatus, NotFoundException,
  Param,
  Post,
  Put,
  Query, Res
} from "@nestjs/common";
import {
  APIPost,
  APIPostDTO,
  Blog,
  WithPagination,
} from '../mongo/mongooseSchemas';
import { Common } from '../common';
import {
  BlogsPaginationCriteriaType,
  paginationCriteriaType,
  PaginatorViewModelType,
  PostsPaginationCriteriaType,
} from '../appTypes';
import express, {Request, Response} from 'express';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly common: Common,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() QueryParams,
  ): Promise<PaginatorViewModelType<Blog>> {
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return await this.blogsService.getAllBlogs(paginationCriteria);
  }
  @Post()
  async createNewBlog(@Body() DTO): Promise<Blog> {
    return this.blogsService.createNewBlog(DTO);
  }
  @Get(':id/posts')
  async getAllPostsForSpecificBlog(@Res() res: Response,@Query() QueryParams,@Param('id') blogId) {
    const paginationCriteria: BlogsPaginationCriteriaType = this.common.getPaginationCriteria(QueryParams);
    const result =  this.blogsService.getAllPostsForSpecificBlog(paginationCriteria, blogId,);
    if(!result){
      throw new NotFoundException("Blog not found")
    } else {
      return result
    }
  }
  @Post(':id/posts')
  async createPostForSpecificBlog(
    @Body() DTO,
    @Param('id') blogId,
    @Res() res: Response
  ): Promise<APIPost | void> {
    const result =  await this.blogsService.createPostForSpecificBlog(DTO, blogId);
    if(!result){
      res.status(HttpStatus.NOT_FOUND).send()
    } else {
      res.status(HttpStatus.CREATED).send(result)
    }
  }
  @Get(':id')
  async getBlogById(@Param('id') id): Promise<Blog> {
    return this.blogsService.getBlogById(id);
  }
  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
                       @Body() DTO,
                       @Param('id') id): Promise<void> {
    const updateResult = await this.blogsService.updateBlogById(DTO, id);
    if(!updateResult){
      throw new NotFoundException("Blog not found")
    }
    return

  }
  @Delete(':id')
  async deleteBlogById(@Res() res: Response,
                       @Param('id') id) {
    await this.blogsService.deleteBlogById(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
