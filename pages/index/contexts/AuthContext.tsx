import { createContext, FC, ReactElement, Reducer, useContext, useReducer } from 'react';
import UserType from '../../../src/types/UserType';

export type State =
  | {
      type: 'Unauthenticated';
    }
  | {
      type: 'Authenticated';
      currentUser: Pick<UserType, 'id' | 'username' | 'avatar' | 'nickname'>;
    };

export type Action =
  | {
      type: 'Login';
      payload: Pick<UserType, 'id' | 'username' | 'avatar' | 'nickname'>;
    }
  | { type: 'Logout' };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'Login':
      return { type: 'Authenticated', currentUser: action.payload };
    case 'Logout':
      return { type: 'Unauthenticated' };
    default:
      return state;
  }
};

const initialState: State = { type: 'Unauthenticated' };

interface AuthContextProviderProps {
  reducer: Reducer<State, Action>;
  children: ReactElement;
}

export const AuthContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

// eslint-disable-next-line @typescript-eslint/no-shadow
export const AuthContextProvider: FC<AuthContextProviderProps> = ({ reducer, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>;
};

export const useAuthStateValue = () => useContext(AuthContext);
