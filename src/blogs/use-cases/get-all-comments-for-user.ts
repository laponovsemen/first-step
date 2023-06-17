import { BanBlogDTO, BanUserDTO } from "../../input.classes";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityDevicesRepository } from "../../security.devices/security.devices.repository";
import { LikeRepository } from "../../likes/likes.repository";
import { CommentsRepository } from "../../comments/comments.repository";
import { paginationCriteriaType } from "../../appTypes";
import { Common } from "../../common";
import { BlogsRepository } from "../blogs.repository";
import { PostsRepository } from "../../posts/posts.repository";
import { BlogsQueryRepository } from "../blogs.query.repository";
import { PostsQueryRepository } from "../../posts/posts.query.repository";

export class GetAllCommentForUserCommand{
  constructor(public queryParams : any,
              public userFromToken : any
  ) {
  }
}
@CommandHandler(GetAllCommentForUserCommand)
export class GetAllCommentForUserUseCase implements ICommandHandler<GetAllCommentForUserCommand>{
  constructor(
    protected securityDevicesRepository: SecurityDevicesRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsRepository: BlogsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected common: Common,
  ) {

  }
  async execute(command : GetAllCommentForUserCommand) {
    const paginationCriteria: paginationCriteriaType = this.common.getPaginationCriteria(command.queryParams);
    const listOfBlogsForSpecifiedUser = await this.blogsQueryRepository.getListOfBlogsByUserId(command.userFromToken.userId)
    console.log(listOfBlogsForSpecifiedUser , " listOfBlogsForSpecifiedUser");
    //return listOfBlogsForSpecifiedUser
    const listOfPostsForBlogs = await this.postsQueryRepository.getListOfPostsByBlogs(listOfBlogsForSpecifiedUser)
    console.log(listOfPostsForBlogs , " listOfPostsForBlogs");
    return listOfPostsForBlogs
  }
}
