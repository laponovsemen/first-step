import { BanBlogDTO, BanUserDTO } from "../../input.classes";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityDevicesRepository } from "../../security.devices/security.devices.repository";
import { LikeRepository } from "../../likes/likes.repository";
import { CommentsRepository } from "../../comments/comments.repository";
import { paginationCriteriaType } from "../../appTypes";
import { Common } from "../../common";
import { BlogsRepository } from "../blogs.repository";
import { PostsRepository } from "../../posts/posts.repository";

export class GetBannedUsersForSpecificBlogCommand{
  constructor(public DTO : BanBlogDTO,
              public blogId : string
  ) {
  }
}
@CommandHandler(GetBannedUsersForSpecificBlogCommand)
export class GetBannedUsersForSpecificBlogUseCase implements ICommandHandler<GetBannedUsersForSpecificBlogCommand>{
  constructor(
    protected securityDevicesRepository: SecurityDevicesRepository,
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    protected common: Common,
  ) {

  }
  async execute(command : GetBannedUsersForSpecificBlogCommand) {
    if (command.DTO.isBanned){
      await this.postsRepository.makeAllPostsForBlogHiden(command.blogId)
    }else {
      await this.postsRepository.makeAllPostsForBlogVisible(command.blogId)
    }
    return this.blogsRepository.changeBanStatusOfBlog(command.DTO, command.blogId);
  }
}