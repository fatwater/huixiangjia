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
