import { BanUserDTO } from "../../input.classes";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users.reposiroty";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class BanProcedureCommand{
  constructor(public userId: string,
              public DTO: BanUserDTO
              ) {
  }
}
@CommandHandler(BanProcedureCommand)
export class BanProcedureUseCase implements ICommandHandler<BanProcedureCommand>{
  constructor(protected usersRepository : UsersRepository) {

  }
  async execute(command : BanProcedureCommand) {
    const newBanStatusOfUser = command.DTO.isBanned

    if(!newBanStatusOfUser){
      return await this.usersRepository.unbanUserDB(command.userId, command.DTO)
    } else {
      return await this.usersRepository.banUserDB(command.userId, command.DTO)
    }

  }



}