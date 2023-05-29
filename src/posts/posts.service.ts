import { Injectable } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { paginationCriteriaType } from "../appTypes";


@Injectable()
export class PostsService{
  constructor(protected readonly postsRepository : PostsRepository) {
  }

  createNewPost(DTO : any){
    return this.postsRepository.createNewPost(DTO)
  }
  getPostById(id : string){
    return this.postsRepository.getPostById(id)
  }

  getAllCommentsForSpecificPosts(paginationCriteria :paginationCriteriaType, id : string){
    return this.postsRepository.getAllCommentsForSpecificPosts(paginationCriteria, id)
  }
}