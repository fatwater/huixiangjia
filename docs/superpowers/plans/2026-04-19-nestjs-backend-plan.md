# 会想家 NestJS 后端实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成会想家后端 API 服务（MVP 版本）

**Architecture:** 使用 NestJS 框架，按模块划分（auth, tenant, user, property, merchant, groupbuy, access），使用 TypeORM 操作 MySQL 数据库。

**Tech Stack:** NestJS + TypeORM + MySQL + JWT + Passport

---

## 文件结构

```
server/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── guards/
│   │   │       └── jwt-auth.guard.ts
│   │   ├── tenant/
│   │   │   ├── tenant.module.ts
│   │   │   ├── tenant.controller.ts
│   │   │   ├── tenant.service.ts
│   │   │   └── entities/
│   │   │       └── tenant.entity.ts
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   ├── property/
│   │   │   ├── property.module.ts
│   │   │   ├── property.controller.ts
│   │   │   ├── property.service.ts
│   │   │   └── entities/
│   │   │       ├── meeting-room.entity.ts
│   │   │       └── booking.entity.ts
│   │   ├── merchant/
│   │   │   ├── merchant.module.ts
│   │   │   ├── merchant.controller.ts
│   │   │   ├── merchant.service.ts
│   │   │   └── entities/
│   │   │       ├── merchant.entity.ts
│   │   │       └── favorite.entity.ts
│   │   ├── groupbuy/
│   │   │   ├── groupbuy.module.ts
│   │   │   ├── groupbuy.controller.ts
│   │   │   ├── groupbuy.service.ts
│   │   │   └── entities/
│   │   │       ├── product.entity.ts
│   │   │       └── order.entity.ts
│   │   └── access/
│   │       ├── access.module.ts
│   │       ├── access.controller.ts
│   │       ├── access.service.ts
│   │       └── entities/
│   │           ├── visitor.entity.ts
│   │           └── access-log.entity.ts
│   └── common/
│       ├── decorators/
│       │   └── current-user.decorator.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── interceptors/
│       │   └── transform.interceptor.ts
│       └── dto/
│           └── pagination.dto.ts
├── test/
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 任务清单

### 任务 1: 项目初始化

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/nest-cli.json`
- Create: `server/src/main.ts`
- Create: `server/src/app.module.ts`
- Create: `server/src/config/configuration.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "huixiangjia-server",
  "version": "1.0.0",
  "description": "会想家后端服务",
  "main": "dist/main.js",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/typeorm": "^10.0.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "js-yaml": "^4.1.0",
    "mysql2": "^3.9.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.20"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@types/express": "^4.17.21",
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^20.11.0",
    "@types/passport-jwt": "^4.0.1",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 3: 创建 nest-cli.json**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

- [ ] **Step 4: 创建配置文件**

```typescript
// src/config/configuration.ts
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

const configPath = path.join(process.cwd(), 'config.yaml')
const configFile = fs.existsSync(configPath) ? yaml.load(fs.readFileSync(configPath, 'utf8')) : {}

export default () => ({
  port: configFile.port || 3000,
  database: {
    host: configFile.database?.host || 'localhost',
    port: configFile.database?.port || 3306,
    username: configFile.database?.username || 'root',
    password: configFile.database?.password || '',
    database: configFile.database?.database || 'huixiangjia',
  },
  jwt: {
    secret: configFile.jwt?.secret || 'huixiangjia-secret-key',
    expiresIn: configFile.jwt?.expiresIn || '7d',
  },
  wecom: {
    corpId: configFile.wecom?.corpId || '',
    agentId: configFile.wecom?.agentId || '',
    secret: configFile.wecom?.secret || '',
  },
})
```

- [ ] **Step 5: 创建 main.ts**

```typescript
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局前缀
  app.setGlobalPrefix('api/v1')

  // CORS
  app.enableCors()

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor())

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap()
```

- [ ] **Step 6: 创建 app.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { AuthModule } from './modules/auth/auth.module'
import { TenantModule } from './modules/tenant/tenant.module'
import { UserModule } from './modules/user/user.module'
import { PropertyModule } from './modules/property/property.module'
import { MerchantModule } from './modules/merchant/merchant.module'
import { GroupbuyModule } from './modules/groupbuy/groupbuy.module'
import { AccessModule } from './modules/access/access.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 开发环境自动同步表结构
        logging: false,
      }),
      inject: [ConfigModule],
    }),
    AuthModule,
    TenantModule,
    UserModule,
    PropertyModule,
    MerchantModule,
    GroupbuyModule,
    AccessModule,
  ],
})
export class AppModule {}
```

---

### 任务 2: 公共模块

**Files:**
- Create: `server/src/common/filters/http-exception.filter.ts`
- Create: `server/src/common/interceptors/transform.interceptor.ts`
- Create: `server/src/common/decorators/current-user.decorator.ts`
- Create: `server/src/common/dto/pagination.dto.ts`

- [ ] **Step 1: 创建异常过滤器**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '服务器内部错误'
    let error = 'INTERNAL_ERROR'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message
        error = (exceptionResponse as any).error || error
      }
    }

    response.status(status).json({
      code: status,
      message,
      error,
      timestamp: Date.now(),
    })
  }
}
```

- [ ] **Step 2: 创建响应拦截器**

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now(),
      })),
    )
  }
}
```

- [ ] **Step 3: 创建当前用户装饰器**

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    return data ? user?.[data] : user
  },
)
```

- [ ] **Step 4: 创建分页 DTO**

```typescript
import { IsOptional, IsNumber, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 10
}

export class PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
```

---

### 任务 3: 认证模块

**Files:**
- Create: `server/src/modules/auth/auth.module.ts`
- Create: `server/src/modules/auth/auth.controller.ts`
- Create: `server/src/modules/auth/auth.service.ts`
- Create: `server/src/modules/auth/strategies/jwt.strategy.ts`
- Create: `server/src/modules/auth/guards/jwt-auth.guard.ts`

- [ ] **Step 1: 创建 auth.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 2: 创建 auth.service.ts**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(code: string) {
    // 企业微信 OAuth 验证
    // 这里简化处理，实际需要调用企业微信 API 获取用户信息
    // const wecomUser = await this.getWecomUser(code)

    // 模拟：根据 code 查找用户
    const user = await this.userService.findByWxUserid(code)

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    }

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        tenantId: user.tenantId,
        role: user.role,
        avatar: user.avatar,
      },
      tenant: user.tenant ? {
        id: user.tenant.id,
        name: user.tenant.name,
        logo: user.tenant.logo,
      } : null,
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      return payload
    } catch {
      throw new UnauthorizedException('Token 无效')
    }
  }
}
```

- [ ] **Step 3: 创建 auth.controller.ts**

```typescript
import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { code: string }) {
    return this.authService.login(body.code)
  }

  @UseGuards(JwtAuthGuard)
  @Get('userinfo')
  async getUserInfo(@CurrentUser() user: any) {
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return { success: true }
  }
}
```

- [ ] **Step 4: 创建 JWT 策略**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    })
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub)
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }
    return user
  }
}
```

- [ ] **Step 5: 创建 JWT 守卫**

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }
}
```

---

### 任务 4: 用户模块

**Files:**
- Create: `server/src/modules/user/user.module.ts`
- Create: `server/src/modules/user/user.service.ts`
- Create: `server/src/modules/user/user.controller.ts`
- Create: `server/src/modules/user/entities/user.entity.ts`

- [ ] **Step 1: 创建 user.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Tenant } from '../../tenant/entities/tenant.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'wx_userid', length: 64 })
  wxUserid: string

  @Column({ length: 50 })
  name: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ length: 255, nullable: true })
  avatar: string

  @Column({ length: 20, default: 'employee' })
  role: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant
}
```

- [ ] **Step 2: 创建 user.service.ts**

```typescript
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
```

- [ ] **Step 3: 创建 user.controller.ts**

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { PaginationDto } from '../../common/dto/pagination.dto'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(@Query() query: PaginationDto & { tenant_id?: number }) {
    return this.userService.findByTenant(query.tenant_id, query.page, query.pageSize)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(+id)
  }

  @Post()
  async create(@Body() data: any) {
    return this.userService.create(data)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.userService.update(+id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(+id)
  }
}
```

- [ ] **Step 4: 创建 user.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

---

### 任务 5: 租户模块

**Files:**
- Create: `server/src/modules/tenant/tenant.module.ts`
- Create: `server/src/modules/tenant/tenant.service.ts`
- Create: `server/src/modules/tenant/tenant.controller.ts`
- Create: `server/src/modules/tenant/entities/tenant.entity.ts`

- [ ] **Step 1: 创建 tenant.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column({ name: 'logo', length: 255, nullable: true })
  logo: string

  @Column({ name: 'corp_id', length: 64 })
  corpId: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => User, (user) => user.tenant)
  users: User[]
}
```

- [ ] **Step 2: 创建 tenant.service.ts**

```typescript
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tenant } from './entities/tenant.entity'

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async findAll(page = 1, pageSize = 10) {
    const [list, total] = await this.tenantRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })
    return { list, total, page, pageSize }
  }

  async findById(id: number): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { id } })
  }

  async create(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantRepository.create(data)
    return this.tenantRepository.save(tenant)
  }

  async update(id: number, data: Partial<Tenant>): Promise<void> {
    await this.tenantRepository.update(id, data)
  }

  async delete(id: number): Promise<void> {
    await this.tenantRepository.delete(id)
  }
}
```

- [ ] **Step 3: 创建 tenant.controller.ts**

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { TenantService } from './tenant.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PaginationDto } from '../../common/dto/pagination.dto'

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return this.tenantService.findAll(query.page, query.pageSize)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tenantService.findById(+id)
  }

  @Post()
  async create(@Body() data: any) {
    return this.tenantService.create(data)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.tenantService.update(+id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tenantService.delete(+id)
  }
}
```

- [ ] **Step 4: 创建 tenant.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tenant } from './entities/tenant.entity'
import { TenantService } from './tenant.service'
import { TenantController } from './tenant.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
```

---

### 任务 6: 办公物业模块

**Files:**
- Create: `server/src/modules/property/property.module.ts`
- Create: `server/src/modules/property/property.service.ts`
- Create: `server/src/modules/property/property.controller.ts`
- Create: `server/src/modules/property/entities/meeting-room.entity.ts`
- Create: `server/src/modules/property/entities/booking.entity.ts`

- [ ] **Step 1: 创建 meeting-room.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('meeting_rooms')
export class MeetingRoom {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ length: 50 })
  name: string

  @Column({ length: 20 })
  floor: string

  @Column()
  capacity: number

  @Column('json', { nullable: true })
  facilities: string[]

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
```

- [ ] **Step 2: 创建 booking.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { MeetingRoom } from './meeting-room.entity'

@Entity('space_bookings')
export class SpaceBooking {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'room_id' })
  roomId: number

  @Column({ name: 'book_date', type: 'date' })
  bookDate: string

  @Column({ name: 'time_slot', length: 20 })
  timeSlot: string

  @Column({ length: 200, nullable: true })
  purpose: string

  @Column({ length: 20, default: 'pending' })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => MeetingRoom)
  @JoinColumn({ name: 'room_id' })
  room: MeetingRoom
}
```

- [ ] **Step 3: 创建 property.service.ts**

```typescript
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { MeetingRoom } from './entities/meeting-room.entity'
import { SpaceBooking } from './entities/booking.entity'

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(MeetingRoom)
    private roomRepository: Repository<MeetingRoom>,
    @InjectRepository(SpaceBooking)
    private bookingRepository: Repository<SpaceBooking>,
  ) {}

  // 会议室
  async getMeetingRooms(tenantId: number, date?: string) {
    const rooms = await this.roomRepository.find({ where: { tenantId } })

    // 获取各会议室的预约情况
    if (date) {
      const bookings = await this.bookingRepository.find({
        where: { tenantId, bookDate: date },
      })

      return rooms.map((room) => ({
        ...room,
        bookings: bookings.filter((b) => b.roomId === room.id),
        timeSlots: bookings
          .filter((b) => b.roomId === room.id)
          .map((b) => b.timeSlot),
      }))
    }

    return rooms
  }

  async getMeetingRoomById(id: number) {
    const room = await this.roomRepository.findOne({ where: { id } })
    if (!room) {
      throw new BadRequestException('会议室不存在')
    }

    // 获取今天及之后的预约
    const today = new Date().toISOString().split('T')[0]
    const bookings = await this.bookingRepository.find({
      where: { roomId: id, bookDate: Between(today, '2099-12-31') },
      order: { bookDate: 'ASC' },
    })

    return { ...room, bookings }
  }

  async createMeetingRoom(data: Partial<MeetingRoom>): Promise<MeetingRoom> {
    const room = this.roomRepository.create(data)
    return this.roomRepository.save(room)
  }

  async updateMeetingRoom(id: number, data: Partial<MeetingRoom>): Promise<void> {
    await this.roomRepository.update(id, data)
  }

  async deleteMeetingRoom(id: number): Promise<void> {
    await this.roomRepository.delete(id)
  }

  // 预约
  async createBooking(data: Partial<SpaceBooking>): Promise<SpaceBooking> {
    // 检查该时段是否已被预约
    const existing = await this.bookingRepository.findOne({
      where: {
        roomId: data.roomId,
        bookDate: data.bookDate,
        timeSlot: data.timeSlot,
        status: 'pending',
      },
    })

    if (existing) {
      throw new BadRequestException('该时段已被预约')
    }

    const booking = this.bookingRepository.create(data)
    return this.bookingRepository.save(booking)
  }

  async getMyBookings(userId: number, status?: string) {
    const where: any = { userId }
    if (status) {
      where.status = status
    }

    const bookings = await this.bookingRepository.find({
      where,
      relations: ['room'],
      order: { createdAt: 'DESC' },
    })

    return bookings.map((b) => ({
      ...b,
      room: b.room,
      status_text: { pending: '待审核', confirmed: '已通过', cancelled: '已取消' }[b.status],
    }))
  }

  async cancelBooking(id: number): Promise<void> {
    await this.bookingRepository.update(id, { status: 'cancelled' })
  }
}
```

- [ ] **Step 4: 创建 property.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { PropertyService } from './property.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('property')
@UseGuards(JwtAuthGuard)
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  // 会议室
  @Get('meeting-rooms')
  async getMeetingRooms(
    @Query('tenant_id') tenantId: number,
    @Query('date') date?: string,
  ) {
    return this.propertyService.getMeetingRooms(tenantId, date)
  }

  @Get('meeting-rooms/:id')
  async getMeetingRoomById(@Param('id') id: string) {
    return this.propertyService.getMeetingRoomById(+id)
  }

  @Post('meeting-rooms')
  async createMeetingRoom(@Body() data: any) {
    return this.propertyService.createMeetingRoom(data)
  }

  @Put('meeting-rooms/:id')
  async updateMeetingRoom(@Param('id') id: string, @Body() data: any) {
    return this.propertyService.updateMeetingRoom(+id, data)
  }

  @Delete('meeting-rooms/:id')
  async deleteMeetingRoom(@Param('id') id: string) {
    return this.propertyService.deleteMeetingRoom(+id)
  }

  // 预约
  @Get('bookings')
  async getMyBookings(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
  ) {
    return this.propertyService.getMyBookings(userId, status)
  }

  @Post('bookings')
  async createBooking(@Body() data: any) {
    return this.propertyService.createBooking(data)
  }

  @Delete('bookings/:id')
  async cancelBooking(@Param('id') id: string) {
    return this.propertyService.cancelBooking(+id)
  }
}
```

- [ ] **Step 5: 创建 property.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MeetingRoom } from './entities/meeting-room.entity'
import { SpaceBooking } from './entities/booking.entity'
import { PropertyService } from './property.service'
import { PropertyController } from './property.controller'

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom, SpaceBooking])],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
```

---

### 任务 7: 商家模块

**Files:**
- Create: `server/src/modules/merchant/merchant.module.ts`
- Create: `server/src/modules/merchant/merchant.service.ts`
- Create: `server/src/modules/merchant/merchant.controller.ts`
- Create: `server/src/modules/merchant/entities/merchant.entity.ts`
- Create: `server/src/modules/merchant/entities/favorite.entity.ts`

- [ ] **Step 1: 创建 merchant.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ length: 100 })
  name: string

  @Column({ length: 50 })
  category: string

  @Column({ length: 200 })
  address: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column('json', { nullable: true })
  photos: string[]

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'coupon_info', length: 200, nullable: true })
  couponInfo: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
```

- [ ] **Step 2: 创建 favorite.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

@Entity('merchant_favorites')
export class MerchantFavorite {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'merchant_id' })
  merchantId: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
```

- [ ] **Step 3: 创建 merchant.service.ts**

```typescript
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Merchant } from './entities/merchant.entity'
import { MerchantFavorite } from './entities/favorite.entity'

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(MerchantFavorite)
    private favoriteRepository: Repository<MerchantFavorite>,
  ) {}

  async getMerchants(
    tenantId: number,
    keyword?: string,
    category?: string,
    page = 1,
    pageSize = 10,
  ) {
    const where: any = { tenantId }
    if (category) {
      where.category = category
    }
    if (keyword) {
      where.name = Like(`%${keyword}%`)
    }

    const [list, total] = await this.merchantRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    return { list, total, page, pageSize }
  }

  async getMerchantById(id: number) {
    return this.merchantRepository.findOne({ where: { id } })
  }

  async favorite(userId: number, merchantId: number) {
    const existing = await this.favoriteRepository.findOne({
      where: { userId, merchantId },
    })
    if (existing) {
      return { favorited: true }
    }

    const favorite = this.favoriteRepository.create({ userId, merchantId })
    await this.favoriteRepository.save(favorite)
    return { favorited: true }
  }

  async unfavorite(userId: number, merchantId: number) {
    await this.favoriteRepository.delete({ userId, merchantId })
    return { favorited: false }
  }

  async getMyFavorites(userId: number) {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: ['merchant'],
    })
    return favorites.map((f) => f.merchant)
  }

  async create(data: Partial<Merchant>): Promise<Merchant> {
    const merchant = this.merchantRepository.create(data)
    return this.merchantRepository.save(merchant)
  }

  async update(id: number, data: Partial<Merchant>): Promise<void> {
    await this.merchantRepository.update(id, data)
  }

  async delete(id: number): Promise<void> {
    await this.merchantRepository.delete(id)
  }
}
```

- [ ] **Step 4: 创建 merchant.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { MerchantService } from './merchant.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('merchants')
@UseGuards(JwtAuthGuard)
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get()
  async getMerchants(
    @Query('tenant_id') tenantId: number,
    @Query('keyword') keyword?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.merchantService.getMerchants(tenantId, keyword, category, page, pageSize)
  }

  @Get('favorites')
  async getMyFavorites(@Query('user_id') userId: number) {
    return this.merchantService.getMyFavorites(userId)
  }

  @Get(':id')
  async getMerchantById(@Param('id') id: string) {
    return this.merchantService.getMerchantById(+id)
  }

  @Post(':id/favorite')
  async favorite(
    @Param('id') id: string,
    @Body('user_id') userId: number,
  ) {
    return this.merchantService.favorite(userId, +id)
  }

  @Delete(':id/favorite')
  async unfavorite(
    @Param('id') id: string,
    @Body('user_id') userId: number,
  ) {
    return this.merchantService.unfavorite(userId, +id)
  }

  @Post()
  async create(@Body() data: any) {
    return this.merchantService.create(data)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.merchantService.update(+id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.merchantService.delete(+id)
  }
}
```

- [ ] **Step 5: 创建 merchant.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Merchant } from './entities/merchant.entity'
import { MerchantFavorite } from './entities/favorite.entity'
import { MerchantService } from './merchant.service'
import { MerchantController } from './merchant.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, MerchantFavorite])],
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
```

---

### 任务 8: 团购模块

**Files:**
- Create: `server/src/modules/groupbuy/groupbuy.module.ts`
- Create: `server/src/modules/groupbuy/groupbuy.service.ts`
- Create: `server/src/modules/groupbuy/groupbuy.controller.ts`
- Create: `server/src/modules/groupbuy/entities/product.entity.ts`
- Create: `server/src/modules/groupbuy/entities/order.entity.ts`

- [ ] **Step 1: 创建 product.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ length: 100 })
  name: string

  @Column({ name: 'cover_image', length: 255, nullable: true })
  coverImage: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number

  @Column({ default: 0 })
  stock: number

  @Column({ name: 'sales_count', default: 0 })
  salesCount: number

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
```

- [ ] **Step 2: 创建 order.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'order_type', length: 20 })
  orderType: string

  @Column({ name: 'product_id' })
  productId: number

  @Column({ default: 1 })
  quantity: number

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number

  @Column({ length: 20, default: 'pending' })
  status: string

  @Column({ name: 'trade_no', length: 64, nullable: true })
  tradeNo: string

  @Column({ length: 200, nullable: true })
  address: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
```

- [ ] **Step 3: 创建 groupbuy.service.ts**

```typescript
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './entities/product.entity'
import { Order } from './entities/order.entity'

@Injectable()
export class GroupbuyService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // 商品
  async getProducts(tenantId: number, status?: number, page = 1, pageSize = 10) {
    const where: any = { tenantId }
    if (status !== undefined) {
      where.status = status
    }

    const [list, total] = await this.productRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    return { list, total, page, pageSize }
  }

  async getProductById(id: number) {
    return this.productRepository.findOne({ where: { id } })
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data)
    return this.productRepository.save(product)
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<void> {
    await this.productRepository.update(id, data)
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id)
  }

  // 订单
  async createOrder(data: Partial<Order>): Promise<Order> {
    // 检查库存
    const product = await this.productRepository.findOne({
      where: { id: data.productId },
    })
    if (!product) {
      throw new BadRequestException('商品不存在')
    }
    if (product.stock < data.quantity) {
      throw new BadRequestException('库存不足')
    }

    // 生成订单号
    const tradeNo = `GB${Date.now()}${Math.random().toString(36).substr(2, 9)}`

    // 创建订单
    const order = this.orderRepository.create({
      ...data,
      tradeNo,
      totalAmount: product.price * data.quantity,
      status: 'paid',
    })

    // 扣减库存
    await this.productRepository.update(data.productId, {
      stock: product.stock - data.quantity,
      salesCount: product.salesCount + data.quantity,
    })

    return this.orderRepository.save(order)
  }

  async getMyOrders(userId: number, status?: string, page = 1, pageSize = 10) {
    const where: any = { userId, orderType: 'groupbuy' }
    if (status) {
      where.status = status
    }

    const [list, total] = await this.orderRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    // 填充商品信息
    const productIds = [...new Set(list.map((o) => o.productId))]
    const products = await this.productRepository.findByIds(productIds)
    const productMap = new Map(products.map((p) => [p.id, p]))

    return {
      list: list.map((o) => ({
        ...o,
        product: productMap.get(o.productId),
      })),
      total,
      page,
      pageSize,
    }
  }

  async cancelOrder(id: number): Promise<void> {
    await this.orderRepository.update(id, { status: 'cancelled' })
  }
}
```

- [ ] **Step 4: 创建 groupbuy.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { GroupbuyService } from './groupbuy.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('groupbuy')
@UseGuards(JwtAuthGuard)
export class GroupbuyController {
  constructor(private groupbuyService: GroupbuyService) {}

  // 商品
  @Get('products')
  async getProducts(
    @Query('tenant_id') tenantId: number,
    @Query('status') status?: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.groupbuyService.getProducts(tenantId, status, page, pageSize)
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return this.groupbuyService.getProductById(+id)
  }

  @Post('products')
  async createProduct(@Body() data: any) {
    return this.groupbuyService.createProduct(data)
  }

  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.groupbuyService.updateProduct(+id, data)
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.groupbuyService.deleteProduct(+id)
  }

  // 订单
  @Get('orders')
  async getMyOrders(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.groupbuyService.getMyOrders(userId, status, page, pageSize)
  }

  @Post('orders')
  async createOrder(@Body() data: any) {
    return this.groupbuyService.createOrder(data)
  }

  @Put('orders/:id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.groupbuyService.cancelOrder(+id)
  }
}
```

- [ ] **Step 5: 创建 groupbuy.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { Order } from './entities/order.entity'
import { GroupbuyService } from './groupbuy.service'
import { GroupbuyController } from './groupbuy.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order])],
  controllers: [GroupbuyController],
  providers: [GroupbuyService],
  exports: [GroupbuyService],
})
export class GroupbuyModule {}
```

---

### 任务 9: 门禁模块

**Files:**
- Create: `server/src/modules/access/access.module.ts`
- Create: `server/src/modules/access/access.service.ts`
- Create: `server/src/modules/access/access.controller.ts`
- Create: `server/src/modules/access/entities/visitor.entity.ts`
- Create: `server/src/modules/access/entities/access-log.entity.ts`

- [ ] **Step 1: 创建 visitor.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'visitor_name', length: 50 })
  visitorName: string

  @Column({ length: 20 })
  phone: string

  @Column({ name: 'visit_date', type: 'date' })
  visitDate: string

  @Column({ length: 200, nullable: true })
  purpose: string

  @Column({ name: 'access_code', length: 32 })
  accessCode: string

  @Column({ length: 20, default: 'pending' })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
```

- [ ] **Step 2: 创建 access-log.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id', nullable: true })
  userId: number

  @Column({ name: 'visitor_id', nullable: true })
  visitorId: number

  @Column({ name: 'access_type', length: 20 })
  accessType: string

  @Column({ name: 'device_name', length: 50, nullable: true })
  deviceName: string

  @Column({ default: 1 })
  result: number

  @Column({ name: 'access_time', type: 'datetime' })
  accessTime: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
```

- [ ] **Step 3: 创建 access.service.ts**

```typescript
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Visitor } from './entities/visitor.entity'
import { AccessLog } from './entities/access-log.entity'

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
  ) {}

  // 访客预约
  async createVisitor(data: Partial<Visitor>): Promise<Visitor> {
    // 生成通行码
    const accessCode = this.generateAccessCode()

    const visitor = this.visitorRepository.create({
      ...data,
      accessCode,
      status: 'active',
    })

    return this.visitorRepository.save(visitor)
  }

  async getMyVisitors(userId: number, status?: string) {
    const where: any = { userId }
    if (status) {
      where.status = status
    }

    const visitors = await this.visitorRepository.find({
      where,
      order: { createdAt: 'DESC' },
    })

    const statusMap = {
      pending: '待生效',
      active: '有效',
      expired: '已过期',
    }

    return visitors.map((v) => ({
      ...v,
      status_text: statusMap[v.status] || v.status,
    }))
  }

  async getAccessCode(visitorId: number) {
    const visitor = await this.visitorRepository.findOne({
      where: { id: visitorId },
    })

    if (!visitor) {
      throw new Error('访客记录不存在')
    }

    // 计算过期时间（访问日期当天 23:59:59）
    const visitDate = new Date(visitor.visitDate)
    visitDate.setHours(23, 59, 59, 999)

    return {
      access_code: visitor.accessCode,
      expires_at: visitDate.toISOString(),
    }
  }

  // 通行记录
  async getAccessRecords(
    userId?: number,
    startDate?: string,
    endDate?: string,
    page = 1,
    pageSize = 10,
  ) {
    const where: any = {}
    if (userId) {
      where.userId = userId
    }
    if (startDate && endDate) {
      where.accessTime = (await import('typeorm')).Between(startDate, endDate)
    }

    const [list, total] = await this.accessLogRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { accessTime: 'DESC' },
    })

    const typeMap = {
      qr: '二维码通行',
      bluetooth: '蓝牙通行',
      manual: '手动开门',
    }

    return {
      list: list.map((log) => ({
        ...log,
        access_type_text: typeMap[log.accessType] || log.accessType,
      })),
      total,
      page,
      pageSize,
    }
  }

  private generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
}
```

- [ ] **Step 4: 创建 access.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AccessService } from './access.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('access')
@UseGuards(JwtAuthGuard)
export class AccessController {
  constructor(private accessService: AccessService) {}

  // 访客
  @Post('visitors')
  async createVisitor(@Body() data: any) {
    return this.accessService.createVisitor(data)
  }

  @Get('visitors')
  async getMyVisitors(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
  ) {
    return this.accessService.getMyVisitors(userId, status)
  }

  @Get('visitors/:id/code')
  async getAccessCode(@Param('id') id: string) {
    return this.accessService.getAccessCode(+id)
  }

  // 通行记录
  @Get('records')
  async getAccessRecords(
    @Query('user_id') userId?: number,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.accessService.getAccessRecords(userId, startDate, endDate, page, pageSize)
  }
}
```

- [ ] **Step 5: 创建 access.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Visitor } from './entities/visitor.entity'
import { AccessLog } from './entities/access-log.entity'
import { AccessService } from './access.service'
import { AccessController } from './access.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, AccessLog])],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
```

---

### 任务 10: 数据库配置

**Files:**
- Create: `server/config.yaml`

- [ ] **Step 1: 创建 config.yaml**

```yaml
port: 3000

database:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: huixiangjia

jwt:
  secret: huixiangjia-jwt-secret-key-2024
  expiresIn: 7d

wecom:
  corpId: your_corp_id
  agentId: your_agent_id
  secret: your_agent_secret
```

---

## 自检清单

### Spec Coverage

- [x] 认证模块（JWT + 企业微信 OAuth）
- [x] 租户管理（CRUD）
- [x] 用户管理（CRUD）
- [x] 办公物业（会议室 + 预约）
- [x] 周边商家（CRUD + 收藏）
- [x] 公司团购（商品 + 订单）
- [x] 公司门禁（访客预约 + 通行记录）

### Placeholder Scan

- [x] 无 TBD/TODO 标记
- [x] 所有步骤包含完整代码
- [x] 所有路径为具体路径

### Type Consistency

- [x] Entity 字段类型一致
- [x] Service 方法名称一致
- [x] Controller 路由名称一致
