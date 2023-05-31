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
import { IsNotEmpty, Length, Matches } from "class-validator";


class PostDTO {
  @IsNotEmpty()
  @Length(1, 30)
  title: string //maxLength: 30
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string // maxLength: 100
  @IsNotEmpty()
  @Length(1, 1000)
  content: string // maxLength: 1000
  blogId: string
}

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
  async createNewPost(@Body() DTO : PostDTO){
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
  async updatePostById(@Res({passthrough : true}) res : Response,
                       @Param('id') id,
                       @Body() DTO : PostDTO){
    const result =  await this.postsService.updatePostById(DTO , id);
    if(!result){
      throw new NotFoundException("post not found")
    }
    return
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Res({passthrough : true}) res : Response ,@Param('id') id) {
    const result =  await this.postsService.deletePostById(id);
    if(!result){
      throw new NotFoundException("post not found")
    }
    return
  }
}