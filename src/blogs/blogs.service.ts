import { BlogsRepository } from './blogs.repository';

export class BlogsService {
  constructor(protected readonly blogsRepository: BlogsRepository) {}
  getAllBlogs(paginationCriteria) {
    return this.blogsRepository.getAllBlogs(paginationCriteria);
  }
  getBlogById(id: string) {
    return this.blogsRepository.getBlogById(id);
  }
  updateBlogById(paginationCriteria) {}
  deleteBlogById(paginationCriteria) {}
  createPostForSpecificBlog(paginationCriteria) {}
  getAllPostsForSpecificBlog(paginationCriteria) {}

  createNewBlog(DTO: any) {
    return this.blogsRepository.createNewBlog(DTO);
  }
}
