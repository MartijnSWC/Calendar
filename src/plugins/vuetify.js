import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import nl from 'vuetify/lib/locale/nl'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { nl },
        current: 'nl',
      },
});
