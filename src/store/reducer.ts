import {combineReducers} from 'redux';
import order from '../slices/order';

import user from '../slices/user';

const rootReducer = combineReducers({
  user: user.reducer,
  order:order.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;