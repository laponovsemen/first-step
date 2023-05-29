import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "../blogs/blogs.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { UsersRepository } from "../users/users.reposiroty";
import { PostsRepository } from "../posts/posts.repository";


@Injectable()
export class TestingService {
  constructor(private readonly blogsRepository: BlogsRepository,
              private readonly postsRepository: PostsRepository,
              private readonly usersRepository: UsersRepository,
              private readonly commentsRepository: CommentsRepository,) {
  }
  async  deleteAllData(){
    await this.blogsRepository.deleteAllData()
    await this.postsRepository.deleteAllData()
    await this.usersRepository.deleteAllData()
    await this.commentsRepository.deleteAllData()
  }
}