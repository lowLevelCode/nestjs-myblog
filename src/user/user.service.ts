import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, EditUserDto } from './dtos';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getMany() {
    return await this.userRepository.find()
  }
  
  async getOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException('User does not exists')

    return user;
  }
  
  async createOne(dto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({ email: dto.email });
    if (userExist) throw new BadRequestException('User already registered with email');

    const newUser = this.userRepository.create(dto)
    const user = await this.userRepository.save(newUser)

    delete user.password;
    return user;
  }
  
  async editOne(id: number, dto: EditUserDto) {
    const user = await this.getOne(id)   
    const editedUser = Object.assign(user, dto);
    return await this.userRepository.save(editedUser);
  }
  
  async deleteOne(id: number) {
    const user = await this.getOne(id);
    return await this.userRepository.remove(user);
  }
}
