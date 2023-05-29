

import { Controller, Delete } from "@nestjs/common";
import { Common } from "../common";
import { BlogsRepository } from "../blogs/blogs.repository";
import { TestingService } from "./testing.service";

@Controller('testing/all-data')
export class testingController {
  constructor(

    private readonly testingService: TestingService,

  ) {}

  @Delete()
  async deleteAllData(){
    await this.testingService.deleteAllData()
  }


}