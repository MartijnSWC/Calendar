<template>
  <v-app>
    <v-content><Calendar/></v-content>
  </v-app>
</template>

<script>
import Calendar from './components/Calendar';
const cookies= require ('js-cookie');
import config from './config'
export default {
  name: 'App',

  components: {
    Calendar,
    
},

  data: () => ({
    ready:false
  }),
  beforeMount() {
		if (cookies.get("kyano_session")) {
			let token = cookies.get('kyano_session')
			this.axios.get(`${config.url.api}/v1/users/0`, { headers: { authorization: `user ${token}` } }).then((res) => {
				this.$store.dispatch('settoken', cookies.get('kyano_session'))
				this.$store.dispatch('setuserdata', res.data)
        this.ready = true;
			})
		} else {
			location.replace(`${config.url.login}/login?r=${encodeURI(location.href)}`)
		}
	}
};
</script>
