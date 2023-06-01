import { LikeRepository } from "./likes.repository";
import { LikeStatusDTO } from "../input.classes";
import { PostsRepository } from "../posts/posts.repository";
import { JwtService } from "@nestjs/jwt";


export class LikeService{
  constructor(protected readonly likeRepository : LikeRepository,
              protected readonly postsRepository : PostsRepository,
              protected readonly jwtService : JwtService,
              ) {
  }


  async likePost(DTO: LikeStatusDTO, token: string, postId : string) {
    const foundPost = await this.postsRepository.getPostById(postId)
    if(!foundPost){
      return null
    }
    const payload = this.jwtService.decode(token)
    if(typeof payload === "string"){
      return null
    }
    const userId = payload.userId
    const login = payload.login
    const like = await this.likeRepository.likePost(DTO, userId, login, postId)
    return true
  }
}