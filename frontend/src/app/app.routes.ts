import { Routes } from '@angular/router';
import { Home } from './home/home';
import { License } from './license/license';
import { NumberGessingGame } from './number-gessing-game/number-gessing-game';
import { ShoppingList } from './shopping-list/shopping-list';
import { Encoding } from './encoding/encoding';
import { Hashing } from './hashing/hashing';
import { Comments } from './comments/comments';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'license', component: License },
  { path: 'number-guessing-game', component: NumberGessingGame },
  { path: 'shopping-list', component: ShoppingList },
  { path: 'encoding', component: Encoding },
  { path: 'hashing', component: Hashing },
  { path: 'comments', component: Comments },
];
