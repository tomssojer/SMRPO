import { createStore } from 'vuex';

// Define your state as an interface
type State = {
  userRole: string | null;
};

export default createStore<State>({
  state: {
    userRole: null,
  },
  mutations: {
    setUserRole(state, userRole: string | null) {
      state.userRole = userRole;
    },
  },
  actions: {},
  modules: {},
});
