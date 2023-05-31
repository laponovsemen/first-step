import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDTO } from "../users/users.controller";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginOrEmail : string, pass : string) {

    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail, pass);
    console.log(user)
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userId : user._id, login : user.login, };
    return {
      access_token: await this.jwtService.signAsync(payload, {secret :jwtConstants.secret}),
      refresh_token: await this.jwtService.signAsync(payload, {expiresIn: '12h', secret :jwtConstants.secret}),
    };
  }

  registration(userDTO: UserDTO) {
    return
  }
}