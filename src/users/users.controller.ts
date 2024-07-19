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
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JWTType } from 'src/types/jwt.types';
import { UpdateUserDto } from './dto/udpate-user.dto';

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
