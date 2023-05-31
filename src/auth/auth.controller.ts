import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request, Res
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UserDTO } from "../users/users.controller";
import { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('password-recovery')
  @HttpCode(HttpStatus.OK)
  passwordRecovery(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.OK)
  newPassword(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res() res: Response,
              @Body() signInDto: UserDTO) {

    const result = await this.authService.signIn(signInDto.login, signInDto.password);
    res.cookie('refreshToken', result.refresh_token, { httpOnly: true, secure: true })
    return {
      accessToken: result.access_token
    }
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.OK)
  registrationConfirmation(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  registration(@Body() userDTO: UserDTO) {
    return this.authService.registration(userDTO)
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.OK)
  registrationEmailResending(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}