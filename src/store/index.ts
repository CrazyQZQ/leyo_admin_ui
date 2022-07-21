import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
}

const vuexLocal = new VuexPersistence<IRootState>({
  storage: window.localStorage
})

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({
  plugins: [vuexLocal.plugin]
})
