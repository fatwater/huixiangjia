import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['tenant'],
    })
  }

  async findByWxUserid(wxUserid: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { wxUserid },
      relations: ['tenant'],
    })
  }

  async findByTenant(tenantId: number, page = 1, pageSize = 10) {
    const [list, total] = await this.userRepository.findAndCount({
      where: { tenantId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })
    return { list, total, page, pageSize }
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data)
    return this.userRepository.save(user)
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    await this.userRepository.update(id, data)
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id)
  }
}
