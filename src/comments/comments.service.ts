import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CommentForSpecifiedPostDTO } from "../input.classes";


@Injectable()
export class CommentsService{
  constructor(protected readonly commentsRepository : CommentsRepository) {
  }


  async getCommentById(commentId : string) {
    return this.commentsRepository.getCommentById(commentId);
  }

  async deleteCommentById( commentId : string) {
    return this.commentsRepository.deleteCommentById(commentId);
  }

  async updateCommentById(commentId: string, DTO: CommentForSpecifiedPostDTO) {
    return await this.commentsRepository.updateCommentById(commentId, DTO)
  }
}
