<template>
<div>
   <v-navigation-drawer
  permanent
  app
  style="width:265px"
  clipped
  flat
>
 <v-btn id="buttonMaken" rounded  @click="dialog = true"
        ><h1 id="plusknopje">+</h1>
        <h4>Maken</h4>
        </v-btn
      >
      <v-date-picker id="datumprikker" focus="today" v-model="focus"></v-date-picker>
         <v-autocomplete
            v-model="differentUser"
            :items="guests"
            item-text="firstname"
            item-value="id"
            outlined
            dense
            chips
            small-chips
            label="🧑Zoeken naar mensen"
            style="width:90%; margin-left: 5%; margin-right: 5%;"
          ></v-autocomplete> 
      <h3 id="mijnagendatekst">Mijn agenda's</h3>
      <div  v-for="kalender in kalender" :key="kalender.calendar">
       <v-checkbox
      v-model="selectedcalenders"
      :label="kalender.calendar_name"
      :value="kalender.calendar"
    ></v-checkbox>
        </div>
        {{selectedcalenders}}
                <v-btn id="persoonlijkeafsprakenknop" rounded @click="$emit('getAllEvents')">{{user.firstname}}'s Agenda</v-btn>
      </v-navigation-drawer>

<!-- Dialog component -->
      <v-dialog
        v-model="dialog"
        fullscreen
        transition="dialog-bottom-transition"
        hide-overlay
      >
        <v-card>
          <v-row>
            <v-col cols="1">
              <v-btn
                fab
                text
                color="secondary"
                @click="dialog = false"
                style="display: flex; margin-top: 33px; margin-left: auto"
              >
                <v-icon style="font-size: 30px"> mdi-window-close </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-form @submit.prevent="$emit('createEvent')" style="margin-top: 40px">
                <h1
                  style="
                    margin-bottom: 15px;
                    font-weight: bold;
                    font-size: 28px;
                  "
                >
                  Nieuwe afspraak
                </h1>
                <div style="display: flex">
                  <v-text-field
                    v-model="name"
                    filled
                    outlined
                    color="blue"
                    label="Titel"
                    type="Text"
                    style="max-width: 400px; min-width: 150px"
                    dense
                    background-color="white"
                  ></v-text-field>
                  <v-btn
                    id="opslaanKnop"
                    type="submit"
                    color="success"
                    style="
                      margin-left: auto;
                      height: 40px;
                      padding-right: min(50px, 5%);
                    "
                    @click.stop="dialog = false"
                  >
                    Opslaan</v-btn
                  >
                </div>

                <v-divider
                  style="height: 25px; margin-bottom: 20px"
                ></v-divider>
                <div style="display: flex">
                  <datePicker
                    v-model="begintijdeventaanmaken"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:00"
                  ></datePicker>
                  <h3>tot</h3>
                  <datePicker
                    v-model="einde"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:00"
                  ></datePicker>
                </div>
                <v-checkbox
                  v-model="begintijdeventaanmaken"
                  label="Hele dag"
                  color="secondary"
                  hide-details
                ></v-checkbox>
                <div style="margin-bottom: 20px; margin-top: 60px">
                  <h2 style="margin-bottom: 8px">Locatie</h2>
                  <v-btn-toggle v-model="adress" mandatory dense>
                    <v-btn style="max-width: 160px; min-width: 160px">
                      Adress
                    </v-btn>
                    <v-btn style="max-width: 160px; min-width: 160px" value="Moermanweg 23">
                      Kantoor
                    </v-btn>
                    <v-btn style="max-width: 160px; min-width: 160px">
                      Online
                    </v-btn>
                  </v-btn-toggle>
                </div>
                <v-text-field
                  v-model="adress"
                  filled
                  outlined
                  color="blue"
                  label="Adress"
                  style="min-width: 150px; margin-top: 4px"
                  dense
                  background-color="white"
                ></v-text-field>
                <v-select dense outlined label="Agenda"></v-select>
                <v-textarea
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Binnen enkele minuten ontvang je een bevestiging per email."
                  outlined
                ></v-textarea>
              </v-form>
            </v-col>
            <v-col cols="7">
              <v-text-field
                v-model="name"
                filled
                outlined
                color="blue"
                label="Titel"
                type="Text"
                style="max-width: 600px"
                dense
                background-color="white"
              ></v-text-field>
       <v-autocomplete
            v-model="guestlist"
            :items="guests"
            item-text="firstname"
            item-value="id"
            outlined
            dense
            chips
            small-chips
            label=""
          ></v-autocomplete> 
      {{this.guests}}
      {{this.firstname}}
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: () => ({
        kalender:null,
            name: null,
            begintijdeventaanmaken: null,
            einde: null,
            dialog: null,
            namen: [],
            adress: null,
        firstname:'',
        selected:[],
        selectedcalenders:[],
        guests:[],
        guestlist:[],
        differentUser:[]
    }),
    watch:{
      selectedcalenders: function (val) {
      console.log(val);
     this.$emit('calendar', this.selectedcalenders);

    },
    differentUser: function (val) {
      console.log(val);
     this.$emit('differentUser', this.differentUser);
     this.kalender=[];
       this.getCalendarsDifferentUser();
     for(var i=0; i<this.kalender.length; i++){
        this.selectedcalenders.push(this.kalender[i].calendar)
      }
    },
       kalender: function (val) {
      console.log(val);
      for(var i=0; i<this.kalender.length; i++){
        this.selectedcalenders.push(this.kalender[i].calendar)
      }
    }
    },
    computed: {
        ...mapGetters({ user: "getuser" }),
            ...mapGetters({ token: "gettoken" }),
    },
    mounted(){
 this.getCalendarsUser();
this.search();
    },
    methods:{ 
         getCalendarsUser() {
      console.log("yes" + this.user.id);
      this.user.id=2;
      this.axios
        .get(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0/calanders`,

          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
                    this.selectedcalenders=[];
          this.kalender=res.data;
                    console.log("kalender: " + this.kalender);

        })
        .catch((error) => {
          console.error(error);
        });
    },
   getCalendarsDifferentUser() {
         this.axios
        .put(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0/getDifferentCalendarsUser`,
          {
            id: this.differentUser,
          },
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log("aaa" + res.data);
          this.selectedcalenders=[];
          this.kalender = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    search() {
      this.axios
        .get(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0/search`,
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          this.guests=res.data;
                    console.log("guests: " + this.guests);

        })
        .catch((error) => {
          console.error(error);
        });
    },
    }
}
</script>

<style>

</style>