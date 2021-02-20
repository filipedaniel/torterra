
import { trigger, state, style, animate, transition } from '@angular/animations';

// Animation slide from left to right
export const flyInOutAnimation =
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate(300)
    ]),
    transition('* => void', [
      animate(300, style({transform: 'translateX(100%)'}))
    ])
  ]);

export const fadeInAnimation =
  trigger('fadeIn', [
    transition('void => *', [
      style({ opacity: 0 }),
      animate(250, style({opacity: 1}))
    ])
  ]);
