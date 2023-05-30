import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.reposiroty";


@Injectable()
export class UsersService{
  constructor(protected readonly usersRepository : UsersRepository) {
  }
  getAllUsers(){
    return this.usersRepository.getAllUsers()
  }

  createUser(DTO : any){
    return this.usersRepository.createUser(DTO)
  }

  deleteUserById(){
    return this.usersRepository.deleteUserById()
  }
}