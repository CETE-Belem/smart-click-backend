import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { generateSalt, hashPassword } from 'src/services/libs/bcrypt';
import { TurnstileService } from 'src/services/turnstile/turnstile.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly turnstileService: TurnstileService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const { captcha, email, name, password } = createUserDto;

    const existingUser = await this.prismaService.usuario.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) throw new ConflictException('Email já cadastrado');

    await this.turnstileService.validateToken(captcha);

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const userProfile = await this.prismaService.perfil.findFirst({
      where: {
        cargo: 'USUARIO',
      },
    });

    const user = await this.prismaService.usuario.create({
      data: {
        email,
        senha: hashedPassword,
        senhaSalt: salt,
        nome: name,
        perfil: {
          connect: {
            cod_perfil: userProfile.cod_perfil,
          },
        },
      },
    });

    const accessToken = await this.authService.createAccessToken(
      user.cod_usuario,
      userProfile.cargo,
    );

    return {
      accessToken,
      user: new UserEntity(user),
    };
  }
}
