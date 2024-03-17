import { createStore } from 'vuex';

// Define your state as an interface
type State = {
  userRole: string | null;
  organizationId: string | null;
};

export default createStore<State>({
  state: {
    userRole: null,
    organizationId: null,
  },
  mutations: {
    setUserRole(state, userRole: string | null) {
      state.userRole = userRole;
    },
    clearUserRole(state) {
      state.userRole = null;
    },
    setOrganizationId(state, id) {
      state.organizationId = id;
    },
    clearOrganizationId(state) {
      state.organizationId = null;
    },
  },
  actions: {},
  modules: {},
});
