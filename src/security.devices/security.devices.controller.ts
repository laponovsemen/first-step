import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus, Param,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { Request, Response } from "express";
import { SecurityDevicesRepository } from "./security.devices.repository";
import { SecurityDevicesService } from "./security.devices.service";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "../auth/auth.guard";
import { ObjectId } from "mongodb";

@Controller("security/devices")
export class SecurityDevicesController{
  constructor(protected readonly securityDevicesService : SecurityDevicesService,
              protected readonly securityDevicesRepository : SecurityDevicesRepository,
              protected readonly jwtService : JwtService) {
  }

  @Get()
  async getAllDevicesForCurrentUser(@Req() req: Request,
                                    @Res({ passthrough: true }) res: Response,
                                    @Query() QueryParams,) {
    const refreshToken = req.cookies.refreshToken

    const result = await this.securityDevicesService.getAllDevicesForCurrentUser(refreshToken)
    if (!result) {
      throw new UnauthorizedException()
    }
    return result
  }


  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllOtherDevices (@Req() req: Request,
                          @Res({ passthrough: true }) res: Response){
    const accessToken : string = req.headers.authorization.split(" ")[1]

    const refreshToken : string = req.cookies.refreshToken
    const refreshTokenPayload: any = this.jwtService.decode(refreshToken)
    const deviceIdFromRefreshToken : string = refreshTokenPayload!.deviceId
    const userIdFromRefreshToken : ObjectId = new ObjectId(refreshTokenPayload!.userId)
    await this.securityDevicesRepository.deleteAllDevicesExcludeCurrentDB(userIdFromRefreshToken, deviceIdFromRefreshToken)
    return
  }
  @UseGuards(AuthGuard)
  @Delete(":deviceId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeviceById (@Req() req: Request,
                          @Res({ passthrough: true }) res: Response,
                          @Param("deviceId") deviceId : string){
  return await this.securityDevicesRepository.deleteDeviceById(deviceId)
  }
}