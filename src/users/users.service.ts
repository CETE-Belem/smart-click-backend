import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
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
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { JWTType } from 'src/types/jwt.types';
import { UpdateUserDto } from './dto/udpate-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AuthService))
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

  async update(
    req: JWTType,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { userId } = req.user;
    const { email, name, password } = updateUserDto;

    const passwordSalt = await generateSalt();
    const hashedPassword = await hashPassword(password, passwordSalt);

    const updatedUser = await this.prismaService.usuario.update({
      where: {
        cod_usuario: userId,
      },
      data: {
        email,
        nome: name,
        senha: hashedPassword,
        senhaSalt: passwordSalt,
      },
    });

    return new UserEntity(updatedUser);
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

  async confirmCode(
    id: string,
    confirmCodeDto: ConfirmCodeDto,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const { code } = confirmCodeDto;
    const user = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: id,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const confirmationCode =
      await this.prismaService.codigo_Confirmacao.findFirst({
        where: {
          cod_usuario: user.cod_usuario,
        },
      });

    if (!confirmationCode)
      throw new NotFoundException('Código de confirmação não encontrado');

    if (confirmationCode.codigo !== code)
      throw new ForbiddenException('Código de confirmação inválido');

    if (
      confirmationCode.expiraEm.getTime() <
      new Date().getTime() + 15 * 60 * 1000
    ) {
      throw new ConflictException('Código de confirmação expirado');
    }

    await this.prismaService.codigo_Confirmacao.delete({
      where: {
        cod_usuario: user.cod_usuario,
      },
    });

    const userProfile = await this.prismaService.perfil.findFirst({
      where: {
        cod_perfil: user.cod_perfil,
      },
    });

    const updatedUser = await this.prismaService.usuario.update({
      where: {
        cod_usuario: user.cod_usuario,
      },
      data: {
        contaConfirmada: true,
      },
    });

    const accessToken = await this.authService.createAccessToken(
      user.cod_usuario,
      userProfile.cargo,
    );

    return {
      accessToken,
      user: new UserEntity(updatedUser),
    };
  }
}