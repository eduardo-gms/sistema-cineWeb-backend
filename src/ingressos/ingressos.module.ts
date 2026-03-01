import { Module } from '@nestjs/common';
import { IngressosController } from './ingressos.controller';
import { IngressosService } from './ingressos.service';

@Module({
  controllers: [IngressosController],
  providers: [IngressosService]
})
export class IngressosModule {}
