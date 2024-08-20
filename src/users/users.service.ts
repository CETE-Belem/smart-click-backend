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
import { generateRecoverCode } from 'src/services/utils/recover-code.utils';
import ConfirmationCode from 'emails/confirmation-code';
import RecoverCode from 'emails/recover-code';
import { MailService } from 'src/mail/mail.service';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { JWTType } from 'src/types/jwt.types';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { Cargo } from '@prisma/client';

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

    const existingConsumerUnity = await this.prismaService.unidade_Consumidora
      .findFirstOrThrow({
        where: {
          numero: createUserDto.consumerUnityNumber,
        },
      })
      .catch(() => {
        throw new NotFoundException('Unidade consumidora inválida');
      });

    if (existingConsumerUnity.cod_usuario)
      throw new ConflictException(
        'Unidade consumidora já pertence a um usuário',
      );

    const existingUser = await this.prismaService.usuario.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) throw new ConflictException('Email já cadastrado');

    await this.turnstileService.validateToken(captcha);

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const user = await this.prismaService.usuario.create({
      data: {
        email,
        senha: hashedPassword,
        senhaSalt: salt,
        nome: name,
        perfil: Cargo.USUARIO,
      },
    });

    // Connect Consumer Unity to User by intermediary table
    await this.prismaService.unidade_Consumidora.update({
      where: {
        cod_unidade_consumidora: existingConsumerUnity.cod_unidade_consumidora,
      },
      data: {
        usuario: {
          connect: {
            cod_usuario: user.cod_usuario,
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

    return new UserEntity(user);
  }

  async update(
    req: JWTType,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { userId } = req.user;
    const { email, name, password } = updateUserDto;

    const user = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: userId,
        email,
      },
    });

    if (!user) throw new ConflictException('Usuário já cadastrado');

    const passwordSalt = password ? await generateSalt() : null;
    const hashedPassword = password
      ? await hashPassword(password, passwordSalt)
      : null;

    const updatedUser = await this.prismaService.usuario.update({
      where: {
        cod_usuario: userId,
      },
      data: {
        email,
        nome: name,
        senha: hashedPassword ?? user.senha,
        senhaSalt: passwordSalt ?? user.senhaSalt,
      },
    });

    return new UserEntity(updatedUser);
  }

  async findAll(
    req: JWTType,
    options: {
      page: number;
      limit: number;
      name: string;
      email: string;
      role: Cargo;
    },
  ): Promise<{
    limit: number;
    page: number;
    totalPages: number;
    users: UserEntity[];
  }> {
    const { email, limit, name, page, role } = options;

    const whereCondition: any = {
      email: {
        contains: email,
      },
      nome: {
        contains: name,
      },
    };

    // Add conditional filtering for perfil and cargo
    if (!!role) {
      whereCondition.perfil = {
        cargo: {
          equals: role,
        },
      };
    }

    const users = await this.prismaService.usuario.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalUsers = await this.prismaService.usuario.count({
      where: {
        email: {
          contains: email,
        },
        nome: {
          contains: name,
        },
        perfil: role,
      },
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      limit,
      page,
      totalPages,
      users: users.map((user) => new UserEntity(user)),
    };
  }

  async findOne(req: JWTType, id: string): Promise<UserEntity> {
    const user = await this.prismaService.usuario
      .findUniqueOrThrow({
        where: {
          cod_usuario: id,
        },
      })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

    return new UserEntity(user);
  }

  async adminUpdateUser(
    req: JWTType,
    id: string,
    adminUpdateUserDto: AdminUpdateUserDto,
  ): Promise<UserEntity> {
    const { name, email, role } = adminUpdateUserDto;

    await this.prismaService.usuario
      .findUniqueOrThrow({
        where: {
          cod_usuario: id,
        },
      })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

    const updatedUser = await this.prismaService.usuario.update({
      where: {
        cod_usuario: id,
      },
      data: {
        nome: name,
        email,
        perfil: role,
      },
    });

    return new UserEntity(updatedUser);
  }

  async getMe(req: JWTType): Promise<UserEntity> {
    const { userId } = req.user;

    const user = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: userId,
      },
    });
    return new UserEntity(user);
  }

  async sendRecoverCode(email: string): Promise<void> {
    const user = await this.prismaService.usuario
      .findUniqueOrThrow({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

    const recoverCode = generateRecoverCode();

    await this.prismaService.codigo_Recuperacao.upsert({
      where: {
        cod_usuario: user.cod_usuario,
      },
      update: {
        codigo: recoverCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), //15 minutes
      },
      create: {
        codigo: recoverCode,
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
        subject: 'Código de recuperação de senha',
        template: RecoverCode({ recoverCode }),
      })
      .then(() => {
        console.log(
          `Email de código de recuperação de senha enviado para ${user.email}`,
        );
      });
  }

  async recoverPassword(
    email: string,
    recoverPasswordDto: RecoverPasswordDto,
  ): Promise<void> {
    const { code, password } = recoverPasswordDto;

    const user = await this.prismaService.usuario
      .findUniqueOrThrow({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

    const recoverCode = await this.prismaService.codigo_Recuperacao.findFirst({
      where: {
        cod_usuario: user.cod_usuario,
      },
    });

    if (!recoverCode)
      throw new NotFoundException('Código de recuperação não encontrado');

    if (recoverCode.codigo !== code)
      throw new ForbiddenException('Código de recuperação inválido');

    if (
      new Date().getTime() >
      recoverCode.expiraEm.getTime() + 15 * 60 * 1000
    ) {
      throw new ConflictException('Código de recuperação expirado');
    }

    const passwordSalt = await generateSalt();
    const hashedPassword = await hashPassword(password, passwordSalt);

    await this.prismaService.codigo_Recuperacao.delete({
      where: {
        cod_usuario: user.cod_usuario,
      },
    });

    await this.prismaService.usuario.update({
      where: {
        cod_usuario: user.cod_usuario,
      },
      data: {
        senha: hashedPassword,
        senhaSalt: passwordSalt,
      },
    });
  }

  async resendRecoverCode(email: string): Promise<void> {
    const user = await this.prismaService.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const recoverCode = generateRecoverCode();

    await this.prismaService.codigo_Recuperacao.upsert({
      where: {
        cod_usuario: user.cod_usuario,
      },
      update: {
        codigo: recoverCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
      create: {
        codigo: recoverCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
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
        subject: 'Código de recuperação de senha',
        template: RecoverCode({ recoverCode }),
      })
      .then(() => {
        console.log(
          `Email de código de recuperação de senha reenviado para ${user.email}`,
        );
      });
  }

  async resendConfirmationCode(email: string): Promise<void> {
    const user = await this.prismaService.usuario
      .findUniqueOrThrow({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

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
    email: string,
    confirmCodeDto: ConfirmCodeDto,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const { code } = confirmCodeDto;
    const user = await this.prismaService.usuario
      .findUniqueOrThrow({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

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
      new Date().getTime() >
      confirmationCode.expiraEm.getTime() + 15 * 60 * 1000
    ) {
      throw new ConflictException('Código de confirmação expirado');
    }

    await this.prismaService.codigo_Confirmacao.delete({
      where: {
        cod_usuario: user.cod_usuario,
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
      Cargo.USUARIO,
    );

    return {
      accessToken,
      user: new UserEntity(updatedUser),
    };
  }
}
