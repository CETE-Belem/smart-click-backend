import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ParseUUIDPipe,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

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
  @ApiParam({ name: 'id', type: 'string' })
  resendConfirmationCode(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.resendConfirmationCode(id);
  }
}
