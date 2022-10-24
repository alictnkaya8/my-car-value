import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { NotFoundException } from '@nestjs/common/exceptions';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email is already in use!');
    // Hash the users password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;
    // Create a new user and save it
    const user = await this.usersService.create(email, hashedPassword);
    // return the user
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('');
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('wrong password!');
    return user;
  }
}
