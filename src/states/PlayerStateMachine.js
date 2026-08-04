import { StateMachine } from './StateMachine.js';
import { IdleState } from './player/IdleState.js';
import { WalkState } from './player/WalkState.js';
import { RunState } from './player/RunState.js';
import { JumpState } from './player/JumpState.js';
import { FallState } from './player/FallState.js';
import { CrouchState } from './player/CrouchState.js';
import { HurtState } from './player/HurtState.js';
import { DieState } from './player/DieState.js';

export class PlayerStateMachine extends StateMachine {
  constructor(player) {
    super(player, {
      idle: IdleState,
      walk: WalkState,
      run: RunState,
      jump: JumpState,
      fall: FallState,
      crouch: CrouchState,
      hurt: HurtState,
      die: DieState
    });
    this.set('idle');
  }
}
