<template>
  <div>
    <v-navigation-drawer
      permanent
      app
      style="width: 265px"
      clipped
      flat
      :key="reload"
    >
      <v-btn id="buttonMaken" rounded @click="dialog = true"
        ><h1 id="plusknopje">+</h1>
        <h4>Maken</h4>
      </v-btn>
      <v-date-picker
        id="datumprikker"
        focus="today"
        v-model="focus"
      ></v-date-picker>
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
        style="width: 90%; margin-left: 5%; margin-right: 5%"
      ></v-autocomplete>
      <h3 id="mijnagendatekst">Mijn agenda's</h3>
      <div v-for="kalender in kalender" :key="kalender.calendar">
        <v-checkbox
          v-model="selectedcalenders"
          :label="kalender.calendar_name"
          :value="kalender.calendar"
        ></v-checkbox>
      </div>
      <!-- {{selectedcalenders}} -->
      <v-btn id="persoonlijkeafsprakenknop" rounded @click="getCalendarsUser"
        >{{ user.firstname }}'s Agenda</v-btn
      >
    </v-navigation-drawer>

    <!-- Dialog component -->
    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
      hide-overlay
      height="100%"
    >
      <!-- Maand picker maken voor hele dag -->
      <v-card>
        <v-form
          @submit.prevent="$emit('createEvent')"
          style="padding-top: 40px"
        >
          <v-row>
            <v-btn fab text color="secondary" @click="dialog = false">
              <v-icon style="font-size: 30px"> mdi-window-close </v-icon>
            </v-btn>
            <v-col cols="5">
              <h1
                style="margin-bottom: 15px; font-weight: bold; font-size: 28px"
              >
                Nieuwe afspraak
              </h1>
              <v-row>
                <v-col cols="9">
                  <v-text-field
                    v-model="name"
                    filled
                    outlined
                    color="blue"
                    label="Titel"
                    type="Text"
                    dense
                    background-color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    id="opslaanKnop"
                    type="submit"
                    color="success"
                    @click.stop="dialog = false"
                  >
                    Opslaan</v-btn
                  >
                </v-col>
              </v-row>
              <v-divider style="margin-bottom: 20px"></v-divider>
              <v-row>
               
                <v-col cols="5">
                   <div v-if="heledag">
                    <datePicker v-model="einde"
                    placeholder="Hele dag invoeren"
                    color="green"
                    ></datePicker>
                 </div>
                 <div v-else>
    <datePicker
                    id="tijdpickerevent"
                    v-model="begintijdeventaanmaken"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:00"
                    color="black"
                  ></datePicker>
                  </div>
                </v-col>
                <v-col cols="2">
                  <div v-if="heledag">
                 </div>
                 <div v-else>
                  <h3>tot</h3>
                 </div>
                </v-col>
                <v-col cols="5">
                  <div v-if="heledag">
                 </div>
                 <div v-else>
                  <datePicker
                    id="tijdpickerevent2"
                    v-model="einde"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:00"
                    color="black"
                  ></datePicker>
</div>
                </v-col>
              </v-row>
              <v-checkbox
                v-model="heledag"
                label="Hele dag"
                color="secondary"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-row style="margin-bottom: 20px; margin-top: 60px">
                <v-col cols="9">
                  <h2 style="margin-bottom: 8px">Locatie</h2>
                  <v-btn-toggle v-model="adress" dense>
                    <v-btn value=""> Adress </v-btn>

                    <v-btn value="Moermanweg 23"> Kantoor </v-btn>

                    <v-btn value="googlemeet"> Online </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col cols="3"> </v-col>
              </v-row>
              <v-text-field
                v-model="adress"
                filled
                outlined
                color="blue"
                label="Adress"
                dense
                background-color="white"
              ></v-text-field>
              <v-select
                :items="kalender"
                item-text="calendar_name"
                item-value="calendar"
                dense
                outlined
                label="Agenda"
              ></v-select>
              <v-textarea
                clearable
                clear-icon="mdi-close-circle"
                label="Descriptie"
                placeholder="Binnen enkele minuten ontvang je een bevestiging per email."
                outlined
              ></v-textarea>
              <h2 id="gastenTekst">Gasten</h2>
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
                multiple
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VueDatetimeJs from "vue-datetime-js";
export default {
  data: () => ({
    kalender: null,
    name: null,
    begintijdeventaanmaken: null,
    einde: null,
    dialog: null,
    namen: [],
    adress: null,
    firstname: "",
    selected: [],
    selectedcalenders: [],
    guests: [],
    guestlist: [],
    differentUser: [],
    reload: 0,
    heledag:false,
  }),
  components: {
    datePicker: VueDatetimeJs,
  },
  watch: {
    selectedcalenders: function (val) {
      console.log(val);
      this.$emit("calendar", this.selectedcalenders);
    },
    differentUser: function (val) {
      console.log(val);
      if (this.differentUser != 0) {
        this.$emit("differentUser", this.differentUser);
        this.kalender = [];
        this.getCalendarsDifferentUser();
        for (var i = 0; i < this.kalender.length; i++) {
          this.selectedcalenders.push(this.kalender[i].calendar);
        }
      }
    },
    kalender: function (val) {
      console.log(val);
      for (var i = 0; i < this.kalender.length; i++) {
        this.selectedcalenders.push(this.kalender[i].calendar);
      }
    },
  },
  computed: {
    ...mapGetters({ user: "getuser" }),
    ...mapGetters({ token: "gettoken" }),
  },
  mounted() {
    this.getCalendarsUser();
    this.search();
  },
  methods: {
    getCalendarsUser() {
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
          this.differentUser = 0;
          this.selectedcalenders = [];
          this.kalender = res.data;
          console.log("kalender testen: " + this.kalender);
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
          this.selectedcalenders = [];
          this.kalender = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    search() {
      this.axios
        .get(`http://localhost/Kyano-Backend-Calendar/v1/Calendar/0/search`, {
          headers: {
            Authorization: `user ${this.token}`,
          },
        })
        .then((res) => {
          this.guests = res.data;
          console.log("guests: " + this.guests);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style></style>
