import { Injectable } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { paginationCriteriaType } from "../appTypes";
import { CommentForSpecifiedPostDTO } from "../input.classes";
import { APIComment, User } from "../mongo/mongooseSchemas";
import { JwtService } from "@nestjs/jwt";
import { CommentsRepository } from "../comments/comments.repository";
import { Common } from "../common";
import { AuthService } from "../auth/auth.service";
import { LikeRepository } from "../likes/likes.repository";
import { ObjectId } from "mongodb";


@Injectable()
export class PostsService{
  constructor(protected readonly postsRepository : PostsRepository,
              protected readonly jwtService : JwtService,
              protected readonly authService : AuthService,
              protected readonly commentsRepository : CommentsRepository,
              protected readonly likeRepository : LikeRepository,
              protected readonly common : Common,
              ) {
  }

  createNewPost(DTO : any){
    return this.postsRepository.createNewPost(DTO)
  }
  async getPostById(id : string, token: string){
    let user : User | null
    let userId = null
    user  = await this.authService.getUserByToken(token);
    if(user){
      userId = user._id
    }

    return await this.postsRepository.getPostById(id, userId)
  }
  async getAllPosts(paginationCriteria: paginationCriteriaType, token: string) {
    const user = await this.authService.getUserByToken(token)
    const allPostsFrames = await this.postsRepository.getAllPosts(paginationCriteria)

    for(let i = 0; i < allPostsFrames.items.length; i++){
      const post = allPostsFrames.items[i]
      const postId = new ObjectId(post.id)
      allPostsFrames.items[i].extendedLikesInfo.likesCount = await this.likeRepository.findLikesCountForSpecificPost(postId)
      allPostsFrames.items[i].extendedLikesInfo.dislikesCount = await this.likeRepository.findDisikesCountForSpecificPost(postId)

    }
    if(!user){
      return allPostsFrames
    } else {
      for(let i = 0; i < allPostsFrames.items.length; i++){
        const post = allPostsFrames.items[i]
        const postId = new ObjectId(post.id)
        const userId = user._id.toString()
        const myLike = await this.likeRepository.findMyStatusForSpecificPost(postId, userId)
        allPostsFrames.items[i].extendedLikesInfo.myStatus = myLike.status
      }

      return allPostsFrames
    }
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