import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { generateSalt, hashPassword } from 'src/services/libs/bcrypt';
import { TurnstileService } from 'src/services/turnstile/turnstile.service';
import { generateConfirmationCode } from 'src/services/utils/confirmation-code.utils';
import ConfirmationCode from 'emails/confirmation-code';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly turnstileService: TurnstileService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
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

    const confirmationCode = generateConfirmationCode();

    await this.prismaService.codigo_Confirmacao.create({
      data: {
        codigo: confirmationCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), //15 minutes
        usuario: {
          connect: {
            cod_usuario: user.cod_usuario,
          },
        },
      },
    });

    this.mailService
      .sendMail({
        email: user.email,
        subject: 'Código de confirmação de conta',
        template: ConfirmationCode({ confirmationCode }),
      })
      .then(() => {
        console.log(
          `Email de código de confirmação de conta enviado para ${user.email}`,
        );
      });

    // const accessToken = await this.authService.createAccessToken(
    //   user.cod_usuario,
    //   userProfile.cargo,
    // );

    // return {
    //   accessToken,
    //   user: new UserEntity(user),
    // };
    return new UserEntity(user);
  }

  async resendConfirmationCode(id: string): Promise<void> {
    const user = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: id,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const confirmationCode = generateConfirmationCode();

    await this.prismaService.codigo_Confirmacao.upsert({
      where: {
        cod_usuario: user.cod_usuario,
      },
      update: {
        codigo: confirmationCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), //15 minutes
      },
      create: {
        codigo: confirmationCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), //15 minutes
        usuario: {
          connect: {
            cod_usuario: user.cod_usuario,
          },
        },
      },
    });

    this.mailService
      .sendMail({
        email: user.email,
        subject: 'Código de confirmação de conta',
        template: ConfirmationCode({ confirmationCode }),
      })
      .then(() => {
        console.log(
          `Email de código de confirmação de conta reenviado para ${user.email}`,
        );
      });
  }
}
