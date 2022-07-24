<template>
   <v-dialog
  v-model="instellingen"
      fullscreen
      transition="dialog-bottom-transition"
      hide-overlay
      persistent
      >  
            <v-card>

      <v-tabs vertical v-model="tabs">
        <v-tab
        v-for="title in settingTabs"
        :key="title"
      >
        {{ title }}
      </v-tab>        
       <v-tabs-items v-model="tabs">
        <v-tab-item>
            <h1>Maak een nieuwe Calendar</h1>
 <v-text-field
                    v-model="calendarname"
                    filled
                    outlined
                    color="black"
                    label="Naam van Calendar"
                    type="Text"
                    dense
                    background-color="white"
                  ></v-text-field>     
                  <div v-for="color in color" :key="color">
        <v-checkbox
          v-model="selectedColor"
          :value="color"
              :color="color"
        ></v-checkbox>
        {{color}}
      </div>   
                  </v-tab-item>
      <v-tab-item>
        <h1>hey</h1>
                </v-tab-item>

      </v-tabs-items>
      </v-tabs>
     
{{this.settingTabs}}

                    </v-card>
    </v-dialog>
</template>

<script>
    import { mapGetters } from "vuex";
export default {
 data () {
    return{
  settingTabs:['Calendar maken', 'Algemene voorwaarden'],
  tabs:null,
  calendarname:'',
    selectedColor:'blue',
    color:['blue', 'red', 'green', 'yellow']
    }
 },
  props:{
instellingen:Boolean,
highestCalendarId:Number
  },
    computed: {
    ...mapGetters({ user: "getuser" }),
    ...mapGetters({ token: "gettoken" }),
  },
  methods:{
  }
}
</script>

<style>

</style>