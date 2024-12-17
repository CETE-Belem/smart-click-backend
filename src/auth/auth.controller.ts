import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login-dto';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiExtraModels(UserEntity)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
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
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas',
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Credenciais inválidas',
      },
    },
  })
  @ApiMethodNotAllowedResponse({
    status: HttpStatus.METHOD_NOT_ALLOWED,
    description: 'Conta não confirmada',
    schema: {
      example: {
        statusCode: HttpStatus.METHOD_NOT_ALLOWED,
        message: 'Conta não confirmada',
      },
    },
  })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
