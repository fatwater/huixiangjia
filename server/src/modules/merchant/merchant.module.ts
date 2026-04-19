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
