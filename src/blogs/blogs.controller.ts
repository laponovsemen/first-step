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
import { paginationCriteriaType } from '../appTypes';
import { BlogsService } from './blogs.service';

@Controller()
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly common: Common,
  ) {}

  @Get('blogs')
  async getAllBlogs(@Query() QueryParams): Promise<WithPagination<Blog[]>> {
    const paginationCriteria: paginationCriteriaType =
      this.common.getBlogsPaginationCriteria(QueryParams);
    return await this.blogsService.getAllBlogs(paginationCriteria);
  }
  @Post('blogs')
  async createNewBlog(@Body() DTO): Promise<Blog> {
    return await this.blogsService.createNewBlog(DTO);
  }
  @Get('blogs/:id/posts')
  async getAllPostsForSpecificBlog(
    @Query() QueryParams,
    @Param('id') blogId,
  ): Promise<APIPost> {
    const paginationCriteria: paginationCriteriaType =
      this.common.getPostsPaginationCriteria(QueryParams);
    return await this.blogsService.getAllPostsForSpecificBlog(
      paginationCriteria,
      blogId,
    );
  }
  @Post('blogs/:id/posts')
  async createPostForSpecificBlog(
    @Body() DTO,
    @Param('id') blogId,
  ): Promise<APIPost[]> {
    return await this.blogsService.createPostForSpecificBlog(DTO, blogId);
  }
  @Get('blogs/:id')
  async getBlogById(@Param('id') id): Promise<APIPost> {
    return await this.blogsService.getBlogById(id);
  }
  @Put('blogs/:id')
  async updateBlogById(@Body() DTO, @Param('id') id): Promise<void> {
    await this.blogsService.updateBlogById(DTO, id);
  }
  @Delete('blogs/:id')
  async deleteBlogById(@Param('id') id): Promise<void> {
    await this.blogsService.deleteBlogById(id);
  }
}
