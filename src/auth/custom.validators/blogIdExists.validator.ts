import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "../../blogs/blogs.repository";

@ValidatorConstraint({  async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(private blogsRepository: BlogsRepository) {}

  async validate(value: string) {
    try {
      return !!await this.blogsRepository.getBlogById(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog doesnt exist with such id`;
  }
}