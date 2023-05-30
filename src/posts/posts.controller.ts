import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res
} from "@nestjs/common";
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

  @Get(':id/comments')
  async getAllCommentsForSpecificPost(
    @Query() QueryParams, @Param('id') id
  ) {
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return this.postsService.getAllCommentsForSpecificPosts(paginationCriteria, id);
  }
  @Get()
  async getAllPosts(@Query() QueryParams){
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return  this.postsService.getAllPosts(paginationCriteria);
  }

  @Post()
  async createNewPost(@Body() DTO){
    return await this.postsService.createNewPost(DTO);
  }

  @Get(':id')
  async getPostById(@Param('id') id){
    const result =  await this.postsService.getPostById(id);
    if(!result){
      throw new NotFoundException("Blog not found")
    }
    return result
  }

  @Put(':id')
  @HttpCode(204)
  async updatePostById(@Param('id') id,
                       @Body() DTO){
    return await this.postsService.updatePostById(DTO , id);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Res() res : Response ,@Param('id') id) {
    const result =  await this.postsService.deletePostById(id);
    if(!result){
      throw new NotFoundException("post not found")
    }
    return
  }
}