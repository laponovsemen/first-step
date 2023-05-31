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
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";



class BlogDTO {
  @IsNotEmpty()
  @Length(1, 15)
  name : string // maxLength: 15

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  description: string // maxLength: 500

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @Length(1, 100)
  websiteUrl : string // maxLength: 100 pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly common: Common,
  ) {}



  @Get()
  @HttpCode(200)
  async getAllBlogs(
    @Query() QueryParams,
  ): Promise<PaginatorViewModelType<Blog>> {
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return this.blogsService.getAllBlogs(paginationCriteria);
  }
  @Post()
  async createNewBlog(@Body() DTO : BlogDTO): Promise<Blog> {
    return this.blogsService.createNewBlog(DTO);
  }
  @Get(':id/posts')
  @HttpCode(200)
  async getAllPostsForSpecificBlog(@Res({passthrough : true}) res: Response,@Query() QueryParams,@Param('id') blogId) {
    const paginationCriteria: paginationCriteriaType = this.common.getPaginationCriteria(QueryParams);
    const result =  await this.blogsService.getAllPostsForSpecificBlog(paginationCriteria, blogId);
    console.log(result)
    if(!result){
      throw new NotFoundException("Blog not found")
    }
    return result

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
  async getBlogById(@Res({passthrough : true}) res: Response,
    @Param('id') id): Promise<Blog> {
    const result = await  this.blogsService.getBlogById(id);
    if(!result){
      throw new NotFoundException("Blog not found")
    }
    return result
  }
  @Put(':id')
  @HttpCode(204)
  async updateBlogById(@Res({passthrough : true}) res: Response,
                       @Body() DTO : BlogDTO,
                       @Param('id') id): Promise<void> {
    const updateResult = await this.blogsService.updateBlogById(DTO, id);
    if(!updateResult){
      throw new NotFoundException("Blog not found")
    }
    return

  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Res({passthrough : true}) res: Response,
                       @Param('id') id) {
    const deletedBlog = await this.blogsService.deleteBlogById(id);
    if(!deletedBlog){
      throw new NotFoundException("Blog not found")
    }
    return

  }
}
