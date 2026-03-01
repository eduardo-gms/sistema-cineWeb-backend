import { Module } from '@nestjs/common';
import { LancheCombosController } from './lanche-combos.controller';
import { LancheCombosService } from './lanche-combos.service';

@Module({
  controllers: [LancheCombosController],
  providers: [LancheCombosService]
})
export class LancheCombosModule {}
