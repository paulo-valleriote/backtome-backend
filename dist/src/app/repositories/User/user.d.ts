import { User } from '@domain/User/User';
import { EditUserDTO } from '@infra/http/dtos/User/editUser.dto';
import { FindedUserDTO } from '@infra/http/dtos/User/findedUser.dto';
import { UserLoginDTO } from '@infra/http/dtos/User/login.dto';
import { NotFoundException } from '@nestjs/common';
export declare abstract class UserRepository {
    abstract register(user: User): Promise<string>;
    abstract login(account: UserLoginDTO): Promise<string | Error>;
    abstract edit(userId: string, account: EditUserDTO): Promise<void | Error>;
    abstract findUserById(userId: string): Promise<User>;
    abstract updatePassword(userId: string, newPassword: string): Promise<boolean>;
    abstract findByEmail(email: string): Promise<FindedUserDTO | NotFoundException>;
}
