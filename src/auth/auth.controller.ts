import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request, Res, UseGuards
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDTO, UserDTO } from "../users/users.controller";
import { Response } from "express";
import { AuthGuard } from "./auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('password-recovery')
  @HttpCode(HttpStatus.OK)
  passwordRecovery(@Body() signInDto: Record<string, any>) {
  }

  @Post('new-password')
  @HttpCode(HttpStatus.OK)
  newPassword(@Body() signInDto: Record<string, any>) {
  }
  //@UseGuards(AuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res() res: Response,
              @Body() signInDto: LoginDTO) {

    const result = await this.authService.signIn(signInDto.loginOrEmail, signInDto.password);
    res.cookie('refreshToken', result.refresh_token, { httpOnly: true, secure: true })
    res.status(200).send({
      accessToken: result.access_token
    })
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() signInDto: Record<string, any>) {
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.OK)
  registrationConfirmation(@Body() signInDto: Record<string, any>) {
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  registration(@Body() userDTO: UserDTO) {
    return this.authService.registration(userDTO)
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.OK)
  registrationEmailResending(@Body() signInDto: Record<string, any>) {
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() signInDto: Record<string, any>) {
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}