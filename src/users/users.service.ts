import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.reposiroty";
import { paginationCriteriaType } from "../appTypes";


@Injectable()
export class UsersService{
  constructor(protected readonly usersRepository : UsersRepository) {
  }
  getAllUsers(paginationCriteria : paginationCriteriaType){
    return this.usersRepository.getAllUsers(paginationCriteria)
  }

  createUser(DTO : any){
    return this.usersRepository.createUser(DTO)
  }

  deleteUserById(id : string){
    return this.usersRepository.deleteUserById(id)
  }
}