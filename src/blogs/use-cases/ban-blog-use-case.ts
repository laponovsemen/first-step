import { BanBlogDTO, BanUserDTO } from "../../input.classes";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityDevicesRepository } from "../../security.devices/security.devices.repository";
import { LikeRepository } from "../../likes/likes.repository";
import { CommentsRepository } from "../../comments/comments.repository";
import { paginationCriteriaType } from "../../appTypes";
import { Common } from "../../common";
import { BlogsRepository } from "../blogs.repository";

export class BanBlogCommand{
  constructor(public DTO : BanBlogDTO,
              public blogId : string) {
  }
}
@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand>{
  constructor(
    protected securityDevicesRepository: SecurityDevicesRepository,
    protected likeRepository: LikeRepository,
    protected blogsRepository: BlogsRepository,
    protected common: Common,
  ) {

  }
  async execute(command : BanBlogCommand) {

    return this.blogsRepository.changeBanStatusOfBlog(command.DTO, command.blogId);
  }
}