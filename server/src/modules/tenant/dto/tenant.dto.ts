import { IsString, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateTenantDto {
  @ApiProperty({ description: '租户名称' })
  @IsString()
  @MaxLength(100)
  name: string

  @ApiProperty({ description: '租户短码(唯一)', example: 'company001' })
  @IsString()
  @MaxLength(50)
  shortCode: string

  @ApiPropertyOptional({ description: '企业Logo' })
  @IsOptional()
  @IsString()
  logo?: string

  @ApiPropertyOptional({ description: '企业地址' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string

  @ApiPropertyOptional({ description: '企业微信CorpId' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  wecomCorpId?: string

  @ApiPropertyOptional({ description: '企业微信AgentId' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  wecomAgentId?: string
}

export class UpdateTenantDto {
  @ApiPropertyOptional({ description: '租户名称' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @ApiPropertyOptional({ description: '企业Logo' })
  @IsOptional()
  @IsString()
  logo?: string

  @ApiPropertyOptional({ description: '企业地址' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string

  @ApiPropertyOptional({ description: '企业微信CorpId' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  wecomCorpId?: string

  @ApiPropertyOptional({ description: '企业微信AgentId' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  wecomAgentId?: string

  @ApiPropertyOptional({ description: '状态: 0-禁用, 1-启用' })
  @IsOptional()
  status?: number
}
