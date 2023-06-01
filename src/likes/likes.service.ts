import { LikeRepository } from "./likes.repository";
import { LikeStatusDTO } from "../input.classes";
import { PostsRepository } from "../posts/posts.repository";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LikeService{
  constructor(protected readonly likeRepository : LikeRepository,
              protected readonly postsRepository : PostsRepository,
              protected readonly jwtService : JwtService,
              ) {
  }


  async likePost(DTO: LikeStatusDTO, token: string, postId : string) {
    console.log(postId)
    const foundPost = await this.postsRepository.getPostByIdWithOutLikes(postId)
    if(!foundPost){
      return null
    }
    console.log(token, " - token");
    const payload = this.jwtService.decode(token)
    if(typeof payload === "string"){
      return null
    }
    console.log(payload, " - payload")
    const userId = payload.userId
    const login = payload.login
    return await this.likeRepository.likePost(DTO, userId, login, postId)
  }
}