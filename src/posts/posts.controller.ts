import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { BlogsService } from "../blogs/blogs.service";
import { Common } from "../common";
import { paginationCriteriaType, PaginatorViewModelType } from "../appTypes";
import { Blog } from "../mongo/mongooseSchemas";
import { PostsService } from "./posts.service";

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly common: Common,
  ) {
  }

  @Get()
  async getAllCommentsForSpecificPost(
    @Query() QueryParams,
  ): Promise<PaginatorViewModelType<Blog>> {
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return await this.postsService.getAllCommentsForSpecificPosts(paginationCriteria);
  }
  @Get()
  async getAllPosts(){
    await this.postsService.getAllPosts(paginationCriteria);
  }

  @Post()
  async createNewPost(@Body() DTO){
    await this.postsService.createNewPost(DTO);
  }

  @Get()
  async getPostById(@Param('id') id){
    await this.postsService.getPostById(id);
  }

  @Put()
  async updatePostById(){
    await this.postsService.updatePostById(paginationCriteria);
  }

  @Delete()
  deletePostById(){
    return this.postsService.deletePostById(paginationCriteria);
  }
}