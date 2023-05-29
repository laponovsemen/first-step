import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { APIPost, Blog, WithPagination } from '../mongo/mongooseSchemas';
import { Common } from '../common';
import {
  BlogsPaginationCriteriaType,
  paginationCriteriaType,
  PaginatorViewModelType,
  PostsPaginationCriteriaType,
} from '../appTypes';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly common: Common,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() QueryParams,
  ): Promise<PaginatorViewModelType<Blog>> {
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return await this.blogsService.getAllBlogs(paginationCriteria);
  }
  @Post()
  async createNewBlog(@Body() DTO): Promise<Blog> {
    return await this.blogsService.createNewBlog(DTO);
  }
  @Get(':id/posts')
  async getAllPostsForSpecificBlog(
    @Query() QueryParams,
    @Param('id') blogId,
  ): Promise<PaginatorViewModelType<APIPost>> {
    const paginationCriteria: BlogsPaginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return this.blogsService.getAllPostsForSpecificBlog(
      paginationCriteria,
      blogId,
    );
  }
  @Post(':id/posts')
  async createPostForSpecificBlog(
    @Body() DTO,
    @Param('id') blogId,
  ): Promise<APIPost[]> {
    return await this.blogsService.createPostForSpecificBlog(DTO, blogId);
  }
  @Get(':id')
  async getBlogById(@Param('id') id): Promise<Blog> {
    return this.blogsService.getBlogById(id);
  }
  @Put(':id')
  async updateBlogById(@Body() DTO, @Param('id') id): Promise<void> {
    await this.blogsService.updateBlogById(DTO, id);
  }
  @Delete(':id')
  async deleteBlogById(@Param('id') id): Promise<void> {
    await this.blogsService.deleteBlogById(id);
  }
}
