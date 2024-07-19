import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ParseUUIDPipe,
  Param,
  Patch,
  UseGuards,
  Request,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JWTType } from 'src/types/jwt.types';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { Cargo } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiExtraModels(UserEntity)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: UserEntity,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Captcha inválido',
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Captcha inválido',
      },
    },
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email já cadastrado',
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: 'Email já cadastrado',
      },
    },
  })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado',
    type: UserEntity,
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  update(@Request() req: JWTType, @Body() udpateUserDto: UpdateUserDto) {
    return this.usersService.update(req, udpateUserDto);
  }

  @Patch('/:id/')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autorizado',
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Usuário não autorizado',
      },
    },
  })
  @ApiBody({
    type: AdminUpdateUserDto,
  })
  @ApiParam({ name: 'id', type: 'string' })
  adminUpdate(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() adminUpdateUserDto: AdminUpdateUserDto,
  ) {
    return this.usersService.adminUpdateUser(req, id, adminUpdateUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários',
    schema: {
      properties: {
        users: {
          type: 'array',
          items: {
            $ref: getSchemaPath(UserEntity),
          },
        },
        totalPages: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiParam({ name: 'name', type: 'string', required: false })
  @ApiParam({ name: 'email', type: 'string', required: false })
  @ApiParam({ name: 'role', type: 'string', required: false })
  @ApiParam({ name: 'page', type: 'number', required: true })
  @ApiParam({ name: 'limit', type: 'number', required: true })
  findAll(
    @Request() req: JWTType,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('role') role: Cargo,
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.usersService.findAll(req, {
      name,
      email,
      role,
      page,
      limit,
    });
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      },
    },
  })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.usersService.findOne(req, id);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Usuário logado',
    type: UserEntity,
  })
  @ApiBearerAuth('token')
  getMe(@Request() req: JWTType) {
    return this.usersService.getMe(req);
  }

  @Patch('/:id/resend-confirmation-code')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Código de confirmação reenviado',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Código de confirmação reenviado',
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Código de confirmação não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Código de confirmação não encontrado',
      },
    },
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Código de confirmação expirado',
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: 'Código de confirmação expirado',
      },
    },
  })
  @ApiParam({ name: 'id', type: 'string' })
  resendConfirmationCode(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.resendConfirmationCode(id);
  }

  @Patch('/:email/send-recover-code')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Código de recuperação enviado',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Código de recuperação enviado',
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      },
    },
  })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'Email do usuário',
  })
  sendRecoverCode(@Param('email') email: string) {
    return this.usersService.sendRecoverCode(email);
  }

  @Patch('/:email/recover-password')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Senha recuperada',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Senha recuperada',
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Código de recuperação não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Código de recuperação não encontrado',
      },
    },
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Código de recuperação expirado',
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: 'Código de recuperação expirado',
      },
    },
  })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'Email do usuário',
  })
  @ApiBody({ type: ConfirmCodeDto })
  recoverPassword(
    @Param('email') email: string,
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ) {
    return this.usersService.recoverPassword(email, recoverPasswordDto);
  }

  @Patch('/:id/confirm-code')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Código de confirmação confirmado',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        user: {
          type: 'object',
          $ref: getSchemaPath(UserEntity),
        },
      },
    },
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Código de confirmação inválido',
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Código de confirmação inválido',
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Código de confirmação não encontrado',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Código de confirmação não encontrado',
      },
    },
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Código de confirmação expirado',
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: 'Código de confirmação expirado',
      },
    },
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: ConfirmCodeDto })
  confirmCode(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() confirmCodeDto: ConfirmCodeDto,
  ) {
    return this.usersService.confirmCode(id, confirmCodeDto);
  }
}
