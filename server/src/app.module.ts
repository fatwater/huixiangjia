import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { AuthModule } from './modules/auth/auth.module'
import { TenantModule } from './modules/tenant/tenant.module'
import { UserModule } from './modules/user/user.module'
import { PropertyModule } from './modules/property/property.module'
import { MerchantModule } from './modules/merchant/merchant.module'
import { GroupbuyModule } from './modules/groupbuy/groupbuy.module'
import { AccessModule } from './modules/access/access.module'
import { HealthModule } from './modules/health/health.module'

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
      inject: [ConfigService],
    }),
    HealthModule,
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
