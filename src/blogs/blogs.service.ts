import { BlogsRepository } from './blogs.repository';
import { paginationCriteriaType } from '../appTypes';
import { Injectable } from "@nestjs/common";

@Injectable()
export class BlogsService {
  constructor(protected readonly blogsRepository: BlogsRepository) {}
  getAllBlogs(paginationCriteria) {
    return this.blogsRepository.getAllBlogs(paginationCriteria);
  }
  getAllPostsForSpecificBlog(
    paginationCriteria: paginationCriteriaType,
    blogId: string,
  ) {
    return this.blogsRepository.getAllPostsForSpecificBlog(
      paginationCriteria,
      blogId,
    );
  }
  getBlogById(id: string) {
    return this.blogsRepository.getBlogById(id);
  }
  updateBlogById(DTO: any, id: string) {
    return this.blogsRepository.updateBlogById(DTO, id);
  }
  deleteBlogById(id: string) {
    return this.blogsRepository.deleteBlogById(id);
  }
  createPostForSpecificBlog(DTO: any, blogId: string) {
    return this.blogsRepository.createPostForSpecificBlog(DTO, blogId);
  }

  createNewBlog(DTO: any) {
    return this.blogsRepository.createNewBlog(DTO);
  }
}
