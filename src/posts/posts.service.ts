import { Injectable } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { paginationCriteriaType } from "../appTypes";
import { CommentForSpecifiedPostDTO } from "../input.classes";
import { APIComment } from "../mongo/mongooseSchemas";
import { Prop } from "@nestjs/mongoose";
import { request } from "express";
import { JwtService } from "@nestjs/jwt";
import { CommentsRepository } from "../comments/comments.repository";


@Injectable()
export class PostsService{
  constructor(protected readonly postsRepository : PostsRepository,
              protected readonly jwtService : JwtService,
              protected readonly commentsRepository : CommentsRepository) {
  }

  createNewPost(DTO : any){
    return this.postsRepository.createNewPost(DTO)
  }
  async getPostById(id : string){
    return await this.postsRepository.getPostById(id)
  }
  getAllPosts(paginationCriteria : paginationCriteriaType){
    return this.postsRepository.getAllPosts(paginationCriteria)
  }
  updatePostById(DTO : any,id : string){
    return this.postsRepository.updatePostById(DTO , id)
  }
  deletePostById(id : string){
    return this.postsRepository.deletePostById(id)
  }

  getAllCommentsForSpecificPosts(paginationCriteria :paginationCriteriaType, id : string){
    return this.postsRepository.getAllCommentsForSpecificPosts(paginationCriteria, id)
  }

  async createCommentForSpecificPost(DTO: CommentForSpecifiedPostDTO, postId: string, token: string) {
    const content = DTO.content
    const payload = await this.jwtService.decode(token)
    if(typeof payload === "string"){
      return false
    }
    const userId = payload.userId
    const login = payload.login
    const dateOfCreation = new Date()
    const commentToCreate: APIComment = {
      content: content,
      commentatorInfo: {
        userId: userId,
        userLogin: login,
      },
      createdAt: dateOfCreation
    }
    return await this.commentsRepository.createNewComment(commentToCreate)

  }
}