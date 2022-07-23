<template>
  <v-row class="fill-height">
    <v-col cols="12" >
 <v-app-bar clipped-left app flat>
          <v-btn id="vandaagknopje" outlined class="mr-4" color="grey darken-2" @click="setToday">
           <h3 id="vandaagtekst">Vandaag</h3> 
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
       
                      <v-icon @click="instellingen = true" id="instellingenwiel">mdi-cog-outline</v-icon>

      
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
        
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dag</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Maand</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 Dagen</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>
<Navbarleft @calendar="getCalendar" @differentUser="getDifferentUser" />
      <v-sheet id="calendarSheet">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :now="today"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          :key="getalletje"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn @click="deleteEvent(selectedEvent.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id" action="">
                {{ selectedEvent.details }}
              </form>
              <form v-else>
                <input
                  v-model="selectedEvent.name"
                  type="text"
                  placeholder="add note"
                />
                <input />
                <input
                  v-model="selectedEvent.color"
                  type="text"
                  placeholder="add note"
                />
                <input />
                <input
                  v-model="selectedEvent.start"
                  type="text"
                  placeholder="start"
                />
                <input />
                <input
                  v-model="selectedEvent.end"
                  type="text"
                  placeholder="add note"
                />
                <input />
                <textarea-autosize
                  v-model="selectedEvent.details"
                  type="text"
                  style="width: 100%"
                  :min-height="100"
                  placeholder="add note"
                >
                </textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Sluiten
              </v-btn>
              <v-btn
                text
                v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent)"
              >
                Edit
              </v-btn>
              <v-btn text v-else @click="updateEvent(selectedEvent)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
      <v-dialog
        v-model="dialogCalendarMaken"
        transition="dialog-bottom-transition"
width="unset"
        hidden-overlay
      >
      <v-card>
       <!-- Maak ding om calendar id te krijgen -->
        <label>Calendar Naam</label>
          <v-text-field
                  v-model="adress"
                  filled
                  outlined
                  color="blue"
                  label="Adress"
                  style="width:50%; margin-top: 4px"
                  dense
                  background-color="white"
                ></v-text-field>
                          <label>Gasten Toevoegen</label>
                          <v-autocomplete
            v-model="differentUser"
            :items="guests"
            item-text="firstname"
            item-value="id"
            outlined
            dense
            chips
            small-chips
            label="Gasten toevoegen"
            style="width:50%"
          ></v-autocomplete> 
</v-card>

      </v-dialog>
 <v-dialog
  v-model="instellingen"
      fullscreen
      transition="dialog-bottom-transition"
      hide-overlay
      >  
      <v-row>
    <v-col cols="12">
      <v-tabs vertical>
        <v-tab>Calendar maken</v-tab>
                <v-tab>Algemene Voorwaarden</v-tab>
                                <v-tab>Uitloggen</v-tab>
      </v-tabs>
    </v-col>
    </v-row>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import VueDatetimeJs from "vue-datetime-js";
import "vue2-datepicker/index.css";
import Navbarleft from "@/components/Navbarleft.vue";
export default {
  components: { datePicker: VueDatetimeJs, Navbarleft},
  data: () => ({
    today: new Date().toISOString().substring(0, 10),
    focus: new Date().toISOString().substring(0, 10),
    type: "week",
    typeToLabel: {
      month: "Maand",
      week: "Week",
      day: "Dag",
      "4dagen": "4 Dagen",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: null,
    name: null,
    start: null,
    end: null,
    currentlyEditing: null,
    getalletje: 0,
    begin: null,
    einde: null,
    selectedcalenders: [],
    kalender: [],
    gebruiker: null,
    dialog: false,
    firstname:null,
    namen:[],
    adress:null,
    begintijdeventaanmaken:null,
    usercalendars:[],
    differentUser:null,
    dialogCalendarMaken:false,
    highestCalendarId:null,
    instellingen:false,
  }),
  mounted() {
    this.incrementerDing();
    this.getAllEvents();
    this.getCalendarsUser();
  },
  computed: {
    ...mapGetters({ token: "gettoken" }),
    ...mapGetters({ user: "getuser" }),
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;
      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;
      const startDay = start.day + ".";
      const endDay = end.day + "e";
      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return ` ${suffixMonth} ${startMonth} ${startYear} ${suffixYear}`;
        case "day":
          return ` ${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "CET",
        month: "long",
      });
    },
  },
  watch: {
        colors(colors) {
      if (!colors) {
        this.colors='blue';
      }
    },
    differentUser(differentUser){
      if(differentUser){
        this.getAllEventsDifferentUser();
      }
      
    },
    user(user) {
      if (user) {
        this.gebruiker = user.id;
        this.getCalendarsUser();
        this.getAllEvents();
        this.getColor();
      }
    },
    selectedcalenders: function (val) {
      console.log(val);
      this.getEventsOfSelectedCalenders();
      this.getColor();
    },
 
  },

  methods: {
    getCalendar(value){
      this.selectedcalenders=value;
console.log("de calendars", value);
    }, getDifferentUser(value){
      this.differentUser=value;
console.log("de calendars", this.differentUser);
    },
    createEvent() {
      console.log(this.begin);
      console.log(this.einde);
      this.axios
        .post(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0`,
          {
            name: this.name,
            details: this.details,
            start: this.begin,
            end: this.einde,
          },
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then(() => {
          this.name = "";
          this.details = "";
          this.begin = "";
          this.einde = "";

          this.getAllEvents();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateEvent(ev) {
      this.axios
        .patch(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0`,
          {
            id: this.currentlyEditing,
            name: ev.name,
            details: ev.details,
            start: ev.start,
            end: ev.end,
          },
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log(this.start);
          console.log(res);
          this.currentlyEditing = null;
          this.selectedOpen = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteEvent(event) {
      this.axios
        .delete(`http://localhost/Kyano-Backend-Calendar/v1/Calendar/0`
          ,
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
            data: {
              id: event,
            },
          }
        )
        .then((res) => {
          console.log("yes" + res);
          this.selectedOpen = false;
          this.getAllEvents();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    incrementerDing() {
      this.getalletje++;
    },
   
    getAllEvents() {
      this.axios
        .get(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0`,
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log("komaan" + res.data);
          this.events = res.data;
          this.colors = "blue";
          console.log("events: " + this.events);
        })
        .catch((error) => {
          console.error(error);
        });
    },
     getAllEventsDifferentUser() {
      this.axios
        .put(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0/getAllEventsDifferentUser`,
          {
          id: this.differentUser
          },
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log("check" + res.data);
          this.events = res.data;
          this.colors = "blue";
          console.log("events: " + this.events);
        })
        .catch((error) => {
          console.error(error);
        });
     },
    getEventsOfSelectedCalenders() {
         this.axios
        .post(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0/selectedCalenders`,
          {
            calenders: this.selectedcalenders,
          },
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          this.events = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
     getHighestCalendarid() {
      this.axios
        .get(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar/0/getHighestCalendarid`,
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log("komaan" + res.data);
          this.highestCalendarId = res.data;
          console.log("eee" + this.highestCalendarId[0].id);
           this.highestCalendarId[0].id+=1;
          console.log("events: " + this.highestCalendarId);
          this.dialogCalendarMaken=true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getColor() {
      this.axios
        .post(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar_Color/0`,
          {
            selectedcalenders: this.selectedcalenders,
          },
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          this.colors = res.data.color;
          console.log("Color: " + this.colors);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getCalendarsUser() {
      console.log(this.gebruiker);
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
          this.kalender=res.data;
                    console.log("kalender: " + this.kalender);

        })
        .catch((error) => {
          console.error(error);
        });
    },
   setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor() {
      return this.colors;
    },
  
    editEvent(ev) {
      this.currentlyEditing = ev.id;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
  },
};
</script>

<style>
</style>
