import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


export default new Vuex.Store({
	state: {
		navigation: {
			sidebar: false
		},
		dialogcollege: {
			dialog: false
		},
		auth: {
			token: null,
		},
		user: {
			id: -1,
			firstname: "",
			lastname: "",
			email: "",
			profilepicture: false,
			staff: false
		},
	},
	mutations: {
		togglesidebar(state) {
			state.navigation.sidebar = !state.navigation.sidebar
		},
		togglecollegedialog(state) {
			state.dialogcollege.dialog = !state.dialogcollege.dialog
		},
		settoken(state, t) {
			state.auth.token = t
		},
		setuserdata(state, data) {
			state.user = data
		},
	},
	actions: {
		togglesidebar({ commit }) {
			commit('togglesidebar')
		},

		togglecollegedialog({ commit }) {
			commit('togglecollegedialog')
		},

		settoken({ commit }, t) {
			commit('settoken', t)
		},
		setuserdata({ commit }, data) {
			commit('setuserdata', data)
		},
		setshops() { //tmp setshop om error vanwege ontbreken setshops() te voorkomen
			console.log("setshops")
		},
	},
	modules: {},
	getters: {
		getnavigation(state) {
			return state.navigation
		},
		getdialogcollege(state) {
			return state.dialogcollege
		},
		getlanguage(state) {
			return state.language
		},
		getuser(state) {
			return state.user;
		},
		gettoken(state) {
			return state.auth.token;
		},
	}
})