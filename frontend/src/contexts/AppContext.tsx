import { createContext, Dispatch, useContext, useMemo, useReducer } from 'react';

// const mergeStates = (currentState, newState) => ({
//   ...currentState,
//   ...newState,
// });

type AppStateType = {
  isConnectWalletModalVisible: boolean;
};

enum ACTION_TYPES_ENUM {
  OPEN_CONNECT_MODAL = 'OPEN_CONNECT_MODAL',
  CLOSE_CONNECT_MODAL = 'CLOSE_CONNECT_MODAL',
}

type ActionType = {
  type: ACTION_TYPES_ENUM;
};

function appStateReducer(state: AppStateType, action: ActionType): AppStateType {
  switch (action.type) {
    case 'OPEN_CONNECT_MODAL': {
      return { ...state, isConnectWalletModalVisible: true };
    }
    case 'CLOSE_CONNECT_MODAL': {
      return { ...state, isConnectWalletModalVisible: false };
    }
    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

export const defaultAppState: AppStateType = {
  isConnectWalletModalVisible: false,
};

const initialState = defaultAppState;

const defaultDispatch: Dispatch<ActionType> = () => initialState;

const AppStateContext = createContext({ state: initialState, dispatch: defaultDispatch });

const AppStateProvider = (props: any) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppStateContext.Provider value={value} {...props} />;
};

function useAppStateContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within a AppStateContext');
  }
  const { state, dispatch } = context;

  const openConnectModal = () => dispatch({ type: ACTION_TYPES_ENUM.OPEN_CONNECT_MODAL });
  const closeConnectModal = () => dispatch({ type: ACTION_TYPES_ENUM.CLOSE_CONNECT_MODAL });

  return {
    state,
    dispatch,
    openConnectModal,
    closeConnectModal,
  };
}

export { AppStateContext, AppStateProvider, useAppStateContext };
