import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        getLang: {},
    },
    mutations: {
        setLang(state, lang) {
            state.getLang = lang;
        },
    },
    getters: {
        getLang: (state) => {
            return state.getLang;
        },
    },
    actions: {},
});
