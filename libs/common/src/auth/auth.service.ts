import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@app/common/auth/types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }
}
