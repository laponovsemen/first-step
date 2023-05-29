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
}