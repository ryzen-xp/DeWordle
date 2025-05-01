import { Module } from '@nestjs/common';
import { WordValidatorService } from './providers/word-validator-service.service';
import { DictionaryModule } from 'src/dictionary/dictionary.module';
import { SpellingBeeController } from './spelling-bee.controller';
import { SpellingBeeService } from './spelling-bee.service';
import { UserModule } from './user/user.module';
import { PuzzleModule } from './games/spelling-bee/puzzle/puzzle.module';
import { GameResultModule } from './games/spelling-bee/game-result/game-result.module';

@Module({
  imports: [UserModule, PuzzleModule, GameResultModule, DictionaryModule],
  controllers: [SpellingBeeController],
  providers: [SpellingBeeService, WordValidatorService],
  exports: [SpellingBeeService, WordValidatorService],
})
export class SpellingBeeModule {}
