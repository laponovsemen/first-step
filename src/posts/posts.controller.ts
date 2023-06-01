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
  Res, UseGuards
} from "@nestjs/common";
import { BlogsService } from "../blogs/blogs.service";
import { Common } from "../common";
import { paginationCriteriaType, PaginatorViewModelType } from "../appTypes";
import { Blog } from "../mongo/mongooseSchemas";
import { PostsService } from "./posts.service";
import { IsNotEmpty, Length, Matches } from "class-validator";
import { CommentForSpecifiedPostDTO, LikeStatusDTO, PostDTO } from "../input.classes";
import { request } from "express";
import { LikeRepository } from "../likes/likes.repository";
import { LikeService } from "../likes/likes.service";
import { AuthGuard } from "../auth/auth.guard";




@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly common: Common,
    private readonly likeService : LikeService
  ) {
  }
  @UseGuards(AuthGuard)
  @Put(':id/like-status')
  async likePost( @Param('id') postId,
                  @Body() DTO : LikeStatusDTO) {
    const token = request.headers.authorization
    return await this.likeService.likePost(DTO, token, postId);
  }

  @Get(':id/comments')
  async getAllCommentsForSpecificPost(@Query() QueryParams, @Param('id') id) {
    const paginationCriteria: paginationCriteriaType = this.common.getPaginationCriteria(QueryParams);
    return this.postsService.getAllCommentsForSpecificPosts(paginationCriteria, id);
  }
  @Post(':id/comments')
  async createCommentForSpecificPost( @Param('id') postId,
                                      @Body() DTO : CommentForSpecifiedPostDTO) {
    const token = request.headers.authorization
    return this.postsService.createCommentForSpecificPost(DTO, postId, token);
  }
  @Get()
  async getAllPosts(@Query() QueryParams){
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return  this.postsService.getAllPosts(paginationCriteria);
  }

  @Post()
  async createNewPost(@Res({passthrough : true}) res : Response, @Body() DTO : PostDTO){

    const result =  await this.postsService.createNewPost(DTO);
    if(!result){
      throw new NotFoundException()
    }
    return
  }

  @Get(':id')
  async getPostById(@Param('id') id){
    const result =  await this.postsService.getPostById(id);
    if(!result){
      throw new NotFoundException("Blog not found")
    }
    return result
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePostById(@Res({passthrough : true}) res : Response,
                       @Param('id') id,
                       @Body() DTO : PostDTO){
    if(!id){
      throw new NotFoundException("id param is undefined or not found")
    }
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