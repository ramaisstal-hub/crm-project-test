import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import type { StringValue } from 'ms';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { Role } from '../common/enums/role.enum';

type AccessPayload = { sub: string; role: Role };
type RefreshPayload = { sub: string; role: Role };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  private signAccess(user: User): string {
    const secret =
      this.cfg.get<string>('JWT_ACCESS_SECRET') ??
      '3f9a8c2b7d1e4f6a9c0d1b2e7f8a9d3c';
    const expiresIn = (this.cfg.get<string>('JWT_ACCESS_EXPIRES_IN') ??
      '15m') as StringValue;

    const payload: AccessPayload = { sub: user.id, role: user.role };
    const opts: JwtSignOptions = { secret, expiresIn };

    return this.jwt.sign(payload, opts);
  }

  private signRefresh(user: User): string {
    const secret =
      this.cfg.get<string>('JWT_REFRESH_SECRET') ??
      '3f9a8c2b7d1e4f6a9c0d1b2e7f8a9d3c';
    const expiresIn = (this.cfg.get<string>('JWT_REFRESH_EXPIRES_IN') ??
      '7d') as StringValue;

    const payload: RefreshPayload = { sub: user.id, role: user.role };
    const opts: JwtSignOptions = { secret, expiresIn };

    return this.jwt.sign(payload, opts);
  }

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      password: passwordHash,
      role: dto.role,
    });

    return {
      userId: user.id,
      accessToken: this.signAccess(user),
      refreshToken: this.signRefresh(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findById(dto.userId);

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Неверный пароль');

    return {
      userId: user.id,
      accessToken: this.signAccess(user),
      refreshToken: this.signRefresh(user),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const secret =
        this.cfg.get<string>('JWT_REFRESH_SECRET') ?? 'dev_refresh_secret';

      const payload = this.jwt.verify<RefreshPayload>(refreshToken, { secret });
      const user = await this.usersService.findById(payload.sub);

      return {
        userId: user.id,
        accessToken: this.signAccess(user),
        refreshToken: this.signRefresh(user),
      };
    } catch {
      throw new UnauthorizedException('Refresh token недействителен');
    }
  }
}
