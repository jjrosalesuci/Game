import { StateMachine } from './StateMachine.js';
import { PatrolState } from './enemy/PatrolState.js';
import { SearchState } from './enemy/SearchState.js';
import { ChaseState } from './enemy/ChaseState.js';
import { AttackState } from './enemy/AttackState.js';
import { HurtState } from './enemy/HurtState.js';
import { DieState } from './enemy/DieState.js';

export class EnemyStateMachine extends StateMachine {
  constructor(enemy) {
    super(enemy, {
      patrol: PatrolState,
      search: SearchState,
      chase: ChaseState,
      attack: AttackState,
      hurt: HurtState,
      die: DieState
    });
    this.set('patrol');
  }
}
