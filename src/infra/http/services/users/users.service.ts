import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@app/repositories/User/user';
import { User } from '@domain/User/User';
import { CpfValidator } from '@app/protocols/cpf/cpfValidator';
import { PhoneValidator } from '@app/protocols/phone/phoneValidator';
import { InvalidParamError } from '@app/errors/InvalidParamError';
import { UserLoginDTO } from '@infra/http/dtos/User/login.dto';
import { EditUserDTO } from '@infra/http/dtos/User/editUser.dto';
import { RegisterUserDTO } from '@infra/http/dtos/User/registerUser.dto';
import { EditPasswordDTO } from '@infra/http/dtos/User/editPassword.dto';
import { EmailValidationResponseDTO } from '@infra/http/dtos/User/emailValidationResponse.dto';
import { z } from 'zod';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private phoneValidator: PhoneValidator,
    private cpfValidator: CpfValidator,
  ) {}

  async register(request: RegisterUserDTO): Promise<User | Error> {
    const newUser = new User(request);

    const cpfIsValid = this.cpfValidator.execute(newUser.props?.cpf as string);
    const phoneIsValid = this.phoneValidator.execute(
      newUser.props?.phone as string,
    );

    if (!cpfIsValid) return new InvalidParamError('cpf');
    if (!phoneIsValid) return new InvalidParamError('phone');

    await this.userRepository.register(newUser);
    return newUser;
  }

  async login(request: UserLoginDTO): Promise<string | Error> {
    const requestSchema = z.object({
      email: z.string().email().min(6, { message: 'Invalid' }),
      password: z.string(),
    });

    const loginProps = requestSchema.safeParse(request);

    if (!loginProps.success) {
      return new BadRequestException('Erro ao realizar login', {
        cause: new BadRequestException(),
        description: loginProps.error.errors[0].message,
      });
    }

    const userLoginResponse = await this.userRepository.login(loginProps.data);

    if (userLoginResponse instanceof BadRequestException) {
      return userLoginResponse;
    }

    return userLoginResponse;
  }

  async edit(userId: string, request: EditUserDTO): Promise<void | Error> {
    if (!userId) {
      return new BadRequestException('Identificação de usuário inválida');
    }

    const editionGoneWrong = await this.userRepository.edit(userId, request);

    if (editionGoneWrong instanceof Error) {
      return editionGoneWrong;
    }
  }

  async editPassword(
    userId: string,
    request: EditPasswordDTO,
  ): Promise<string> {
    if (!userId) {
      throw new BadRequestException('Identificação de usuário inválida');
    }
    const { currentPassword, newPassword } = request;

    const user = await this.userRepository.findUserById(userId);

    if (!('password' in user)) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.password !== currentPassword) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const updatedPassword = await this.userRepository.updatePassword(
      userId,
      newPassword,
    );

    if (updatedPassword) {
      return 'Senha alterada com sucesso!';
    }

    return 'Senha não foi alterada!';
  }

<<<<<<< HEAD
  async validateEmail(email: string): Promise<EmailValidationResponseDTO> {
=======
  async resetPassword(
    userId: string,
    request: ResetPasswordDTO,
  ): Promise<string> {
    const { password } = request;

    if (!userId) {
      return 'Identificação de usuário inválida';
    }

    const user = await this.userRepository.findUserById(userId);

    if (!('password' in user)) {
      return 'Usuário não encontrado';
    }
    const updatedPassword = await this.userRepository.updatePassword(
      userId,
      password,
    );
    console.log(updatedPassword)
    if (!updatedPassword) {
      return 'Erro ao alterar senha!';
    }
    return 'Senha alterada com sucesso!';
  }

  async validateEmail(email: string): Promise<string> {
>>>>>>> 23e345a (alterado retorno da change-password)
    const bodySchema = z.string().email({ message: 'E-mail' });
    const sendedEmail = bodySchema.safeParse(email);

    if (!sendedEmail.success) {
      throw new InvalidParamError(sendedEmail.error.message);
    }

    const emailIsValid = await this.userRepository.findByEmail(
      sendedEmail.data,
    );

    if (emailIsValid instanceof NotFoundException) {
      return {
        isAvailable: true,
        message: 'Nenhum usuário está cadastrado com este e-mail',
      };
    }

    return {
      isAvailable: false,
      message: 'Já existe um usuário cadastrado com este e-mail',
    };
  }

  async passwordRecovery(request: PasswordRecoveryDTO): Promise<string> {
    const bodySchema = z.object({
      email: z.string().email({ message: 'E-mail' }),
      cpf: z.string(),
    });

    const requestBody = bodySchema.safeParse(request);

    if (!requestBody.success) {
      if (requestBody.error.message === 'E-mail') {
        throw new InvalidParamError('E-mail');
      }

      throw new MissingParamError(`${requestBody.error.errors[0].path[0]}`);
    }

    const userId = await this.userRepository.findByEmail(
      requestBody.data.email,
    );

    return `${process.env.FRONTEND_URL}/${userId}`;
  }
}
