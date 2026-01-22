import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  private signAccess(user: User) {
    return this.jwt.sign({ sub: user.id, role: user.role });
  }

  private signRefresh(user: User) {
    const secret = this.cfg.get<string>(
      'JWT_REFRESH_SECRET',
      'dev_refresh_secret',
    );
    const expiresIn = this.cfg.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    return this.jwt.sign({ sub: user.id }, { secret, expiresIn });
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
      const secret = this.cfg.get<string>(
        'JWT_REFRESH_SECRET',
        'dev_refresh_secret',
      );
      const payload = this.jwt.verify<{ sub: string }>(refreshToken, {
        secret,
      });
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
