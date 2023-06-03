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

    let userId = null
    const userFromDb  = await this.authService.getUserByToken(token);
    console.log(userFromDb, "userFromDb");
    console.log(token, "token");
    if(userFromDb){
      userId = userFromDb._id
    }
    console.log(userId, "userId");
    return await this.postsRepository.getPostById(id, userId)
  }
  async getAllPosts(paginationCriteria: paginationCriteriaType, token: string) {
    const user = await this.authService.getUserByToken(token)
    console.log(user , 'user');
    const allPostsFrames = await this.postsRepository.getAllPosts(paginationCriteria)

    for(let i = 0; i < allPostsFrames.items.length; i++){
      const post = allPostsFrames.items[i]
      const postId = new ObjectId(post.id)
      allPostsFrames.items[i].extendedLikesInfo.likesCount = await this.likeRepository.findLikesCountForSpecificPost(postId)
      allPostsFrames.items[i].extendedLikesInfo.dislikesCount = await this.likeRepository.findDisikesCountForSpecificPost(postId)
      allPostsFrames.items[i].extendedLikesInfo.newestLikes = await this.likeRepository.findNewestLikesForSpecificPost(postId)

    }
    if(!user){
      //console.log("i am out");
      //console.log(user, "user");
      return allPostsFrames
    } else {
      console.log("i am in ");
      const userId = user._id.toString()
      //console.log(userId, " id of user ");
      for(let i = 0; i < allPostsFrames.items.length; i++){
        const post = allPostsFrames.items[i]
        const postId = new ObjectId(post.id)

        const myLike = await this.likeRepository.findMyStatusForSpecificPost(postId, userId)
        console.log(myLike , "myLike");
        //console.log(postId , "postId");
        allPostsFrames.items[i].extendedLikesInfo.myStatus = myLike ? myLike.status : "None"
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
    const user = await this.authService.getUserByToken(token)
    if(!user){
      return null
    }

    const newComment: APIComment ={
      content: content,
      commentatorInfo: {
        userId: user._id,
        userLogin: user.login,
      },
      createdAt: new Date()
    }
    console.log(newComment);
    const createdComment = await this.commentsRepository.createNewComment({...newComment})
    return {
      id: createdComment._id.toString(),
     ...newComment,
      likesInfo: {
        likesCount : 0,
        dislikesCount : 0,
        myStatus : "None"
      }
    }

  }
}