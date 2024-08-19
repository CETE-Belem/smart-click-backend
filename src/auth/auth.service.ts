import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcrypt';
import { TurnstileService } from 'src/services/turnstile/turnstile.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { Usuario } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly turnstileService: TurnstileService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async createAccessToken(user: Usuario): Promise<string> {
    return await this.jwtService.signAsync(
      {
        userId: user.cod_usuario,
        role: user.perfil,
        email: user.email,
        confirmEmail: user.contaConfirmada,
      },
      {
        privateKey: process.env.JWT_PRIVATE_KEY,
        algorithm: 'RS256',
      },
    );
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
    const matches = await bcrypt.compare(password, userPassword);

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
        throw new UnauthorizedException('Usuário não encontrado');
      });

    if (!user.contaConfirmada) {
      await this.usersService.resendConfirmationCode(user.email);
    }

    await this.checkPassword(user.senha, password);

    await this.turnstileService.validateToken(captcha);

    const accessToken = await this.createAccessToken(user);

    return {
      accessToken,
      user: new UserEntity(user),
    };
  }
}
