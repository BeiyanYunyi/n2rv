import { createContext, FC, ReactElement, Reducer, useContext, useReducer } from 'react';

export type State = {
  replyTo: string | undefined;
};

export type Action =
  | {
      type: 'ReplyTo';
      payload: string;
    }
  | { type: 'Cancel' };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ReplyTo':
      return { ...state, replyTo: action.payload };
    case 'Cancel':
      return { ...state, replyTo: undefined };
    default:
      return state;
  }
};

const initialState: State = { replyTo: undefined };

interface ReplyContextProviderProps {
  reducer: Reducer<State, Action>;
  children: ReactElement;
}

export const ReplyContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

// eslint-disable-next-line @typescript-eslint/no-shadow
export const ReplyContextProvider: FC<ReplyContextProviderProps> = ({ reducer, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <ReplyContext.Provider value={[state, dispatch]}>{children}</ReplyContext.Provider>;
};

export const useReplyStateValue = () => useContext(ReplyContext);
