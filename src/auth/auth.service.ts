import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDTO } from "../users/users.controller";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(login, pass) {

    const user = await this.usersService.findUserByLogin(login);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userId : user._id, login : user.login, };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {expiresIn: '12h'}),
    };
  }

  registration(userDTO: UserDTO) {
    return
  }
}