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
                 <v-row>
                  <v-col cols="3"></v-col>
                  <v-col cols="5">
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
                  <v-row> 
                  <div v-for="color in color" :key="color">
        <v-checkbox
          v-model="selectedColor"
          :value="color"
              :color="color"
        ></v-checkbox>
      </div>   
      </v-row> 
      </v-col>
                        <v-col cols="4">
                            <v-btn fab text color="secondary" @click="instellingen = false">
              <v-icon style="font-size: 30px"> mdi-window-close </v-icon>
            </v-btn>
</v-col>
      </v-row>
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
  watch:{
  instellingen: function (val) {
      console.log(val);
      this.$emit("instellingen", this.instellingen);
  },
    },
  methods:{
  }
}
</script>

<style>

</style>