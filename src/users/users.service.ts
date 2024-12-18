import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { generateSalt, hashPassword } from '../services/libs/bcrypt';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { JWTType } from '../types/jwt.types';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { Cargo, Subgrupo } from '@prisma/client';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { ConsumerUnitEntity } from '../consumer-units/entities/consumer-unit.entity';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { TurnstileService } from '../services/turnstile/turnstile.service';
import { generateConfirmationCode } from '../services/utils/confirmation-code.utils';
import { generateRecoverCode } from '../services/utils/recover-code.utils';
import ConfirmationCode from '../../emails/confirmation-code';
import RecoverCode from '../../emails/recover-code';
import { MailService } from '../mail/mail.service';

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
        email: email.toLocaleLowerCase(),
      },
    });

    if (existingUser) throw new ConflictException('Email já cadastrado');

    await this.turnstileService.validateToken(captcha);

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const user = await this.prismaService.usuario.create({
      data: {
        email: email.toLocaleLowerCase(),
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
        codigo: confirmationCode.hashedCode,
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
        template: ConfirmationCode({ confirmationCode: confirmationCode.code }),
      })
      .then(() => {
        console.log(
          `Email de código de confirmação de conta enviado para ${user.email}`,
        );
      });

    return new UserEntity(user);
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { email, name, password } = createAdminDto;

    const existingUser = await this.prismaService.usuario.findFirst({
      where: {
        email: email.toLocaleLowerCase(),
      },
    });

    if (existingUser) throw new ConflictException('Email já cadastrado');

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const user = await this.prismaService.usuario.create({
      data: {
        email: email.toLocaleLowerCase(),
        senha: hashedPassword,
        senhaSalt: salt,
        nome: name,
        perfil: Cargo.ADMIN,
      },
    });

    const confirmationCode = generateConfirmationCode();

    await this.prismaService.codigo_Confirmacao.create({
      data: {
        codigo: confirmationCode.hashedCode,
        expiraEm: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        usuario: {
          connect: {
            cod_usuario: user.cod_usuario,
          },
        },
      },
    });

    return new UserEntity(user);
  }

  async update(
    req: JWTType,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { userId } = req.user;
    const { email, name, password } = updateUserDto;

    const existingUserWithThisEmail =
      await this.prismaService.usuario.findFirst({
        where: {
          email: email.toLocaleLowerCase(),
          cod_usuario: {
            not: userId,
          },
        },
      });

    const user = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: userId,
      },
    });

    if (existingUserWithThisEmail)
      throw new ConflictException('Email já cadastrado');

    if (!bcrypt.compareSync(password, user.senha)) {
      throw new ForbiddenException('Senha incorreta');
    }

    const updatedUser = await this.prismaService.usuario.update({
      where: {
        cod_usuario: userId,
      },
      data: {
        email: email.toLocaleLowerCase(),
        nome: name,
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
      query: string;
      role: Cargo;
    },
  ): Promise<{
    limit: number;
    page: number;
    totalUsers: number;
    totalPages: number;
    users: UserEntity[];
  }> {
    const { email, limit, name, page, role, query } = options;

    const whereCondition: any = {
      email: {
        contains: email,
      },
      nome: {
        contains: name,
      },
    };

    if (!!query) {
      whereCondition.OR = [
        {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          nome: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ];
    }

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
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      limit,
      page,
      totalUsers,
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

    const existingUser = await this.prismaService.usuario.findFirst({
      where: {
        cod_usuario: {
          not: id,
        },
        email,
      },
    });

    if (existingUser) throw new ConflictException('Email já cadastrado');

    const updatedUser = await this.prismaService.usuario.update({
      where: {
        cod_usuario: id,
      },
      data: {
        nome: name,
        email: email.toLocaleLowerCase(),
        perfil: role,
      },
    });

    return new UserEntity(updatedUser);
  }

  async getMe(req: JWTType): Promise<{
    user: UserEntity;
    equipmentId?: string;
  }> {
    const { userId } = req.user;

    const user = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: userId,
      },
      include: {
        unidades_consumidoras: {
          include: {
            equipamentos: true,
          },
        },
      },
    });

    const hasOneEquipmentAndUC =
      user.unidades_consumidoras.length == 1 &&
      user.unidades_consumidoras[0].equipamentos.length == 1;
    return {
      user: new UserEntity(user),
      equipmentId: hasOneEquipmentAndUC
        ? user.unidades_consumidoras[0].equipamentos[0].cod_equipamento
        : null,
    };
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
        codigo: recoverCode.hashedCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), //15 minutes
      },
      create: {
        codigo: recoverCode.hashedCode,
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
        template: RecoverCode({ recoverCode: recoverCode.code }),
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

    if (!bcrypt.compareSync(code, recoverCode.codigo))
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
        codigo: recoverCode.hashedCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
      create: {
        codigo: recoverCode.hashedCode,
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
        template: RecoverCode({ recoverCode: recoverCode.code }),
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
        codigo: confirmationCode.hashedCode,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), //15 minutes
      },
      create: {
        codigo: confirmationCode.hashedCode,
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
        template: ConfirmationCode({ confirmationCode: confirmationCode.code }),
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

    if (!bcrypt.compareSync(code, confirmationCode.codigo))
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

    const accessToken = await this.authService.createAccessToken(updatedUser);

    return {
      accessToken,
      user: new UserEntity(updatedUser),
    };
  }

  async delete(req: JWTType, id: string): Promise<void> {
    const { userId } = req.user;

    if (userId === id)
      throw new ForbiddenException('Você não pode deletar sua própria conta');

    await this.prismaService.usuario
      .delete({
        where: {
          cod_usuario: id,
        },
      })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });
  }

  async findConsumerUnits(
    req: JWTType,
    page: number,
    limit: number,
    filters: {
      city?: string;
      uf?: string;
      concessionaireId?: string;
      subgroup?: Subgrupo;
    },
  ): Promise<{
    consumerUnits: ConsumerUnitEntity[];
    page: number;
    limit: number;
    totalPages: number;
    totalConsumerUnits: number;
    filters: {
      city?: string;
      uf?: string;
      concessionaireId?: string;
      subgroup?: Subgrupo;
    };
  }> {
    const { city, concessionaireId, uf, subgroup } = filters;

    const units = await this.prismaService.unidade_Consumidora.findMany({
      where: {
        cod_usuario: req.user.userId,
        cidade: city,
        cod_concessionaria: concessionaireId,
        uf,
        subgrupo: subgroup,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalConsumerUnits =
      await this.prismaService.unidade_Consumidora.count({
        where: {
          cod_usuario: req.user.userId,
          cidade: city,
          cod_concessionaria: concessionaireId,
          uf,
        },
      });

    const totalPages = Math.ceil(totalConsumerUnits / limit);

    return {
      consumerUnits: units.map((unit) => new ConsumerUnitEntity(unit)),
      limit,
      page,
      totalPages,
      totalConsumerUnits,
      filters,
    };
  }

  async getUserConsumerUnits(
    userId: string,
    page: number,
    limit: number,
    filters: {
      query?: string;
    },
  ) {
    if (page <= 0 || limit <= 0) {
      throw new BadRequestException(
        'Os parâmetros page/limit devem ser maiores que 0.',
      );
    }

    const user = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: userId,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    let whereClause = {};

    if (filters.query) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            cidade: {
              contains: filters.query,
              mode: 'insensitive',
            },
          },
          {
            uf: {
              contains: filters.query,
              mode: 'insensitive',
            },
          },
          {
            numero: {
              contains: filters.query,
              mode: 'insensitive',
            },
          },
          {
            concessionaria: {
              nome: {
                contains: filters.query,
                mode: 'insensitive',
              },
            },
          },
        ],
      };
    }

    const consumerUnits = await this.prismaService.unidade_Consumidora.findMany(
      {
        where: {
          ...whereClause,
          cod_usuario: userId,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          criadoEm: 'desc',
        },
        include: {
          concessionaria: true,
          equipamentos: true,
        },
      },
    );

    const totalConsumerUnits =
      await this.prismaService.unidade_Consumidora.count({
        where: {
          ...whereClause,
          cod_usuario: userId,
        },
      });

    const totalPages = Math.ceil(totalConsumerUnits / limit);

    return {
      limit,
      page,
      totalPages,
      totalConsumerUnits,
      consumerUnits: consumerUnits.map(
        (consumerUnits) => new ConsumerUnitEntity(consumerUnits),
      ),
      filters,
    };
  }
}
