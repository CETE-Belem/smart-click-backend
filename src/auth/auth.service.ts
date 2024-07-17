import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcrypt';
import { TurnstileService } from 'src/services/turnstile/turnstile.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { Cargo } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly turnstileService: TurnstileService,
    private readonly jwtService: JwtService,
  ) {}

  public async createAccessToken(userId: string, role: Cargo): Promise<string> {
    return await this.jwtService.signAsync({ userId, role });
  }

  /**
   * Check if the password is correct
   * @param password
   * @param userPassword
   * @returns void
   * @throws UnauthorizedException
   */
  public async checkPassword(
    userPassword: string,
    password: string,
  ): Promise<void> {
    const matches = await bcrypt.compare(userPassword, password);

    if (!matches) throw new UnauthorizedException('Credenciais inválidas');
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const { captcha, email, password } = loginDto;
    const user = await this.prismaService.usuario
      .findUniqueOrThrow({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

    const profile = await this.prismaService.perfil.findUnique({
      where: {
        cod_perfil: user.cod_perfil,
      },
    });

    await this.checkPassword(user.senha, password);

    await this.turnstileService.validateToken(captcha);

    const accessToken = await this.createAccessToken(
      user.cod_usuario,
      profile.cargo,
    );

    return {
      accessToken,
      user: new UserEntity(user),
    };
  }
}
