<template>
  <v-row class="fill-height">
    <v-col cols="3">
      <v-btn rounded style="width: 180px; height: 40px" @click="dialog = true"
        ><h3>+ Maken</h3></v-btn
      >
      <v-date-picker focus="today" v-model="focus"></v-date-picker>
      <v-selector
        v-model="calendarid"
        :options="kalenderid"
        item-text="text"
        item-value="value"
      ></v-selector>
    </v-col>
    <v-col cols="9">
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Vandaag
          </v-btn>
          <v-btn @click="getAllEvents">get</v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
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
        </v-toolbar>
      </v-sheet>

      <!-- Event Form-->
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
              <v-form @submit.prevent="createEvent" style="margin-top: 40px">
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
                    v-model="begin"
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
                  v-model="begin"
                  label="Hele dag"
                  color="secondary"
                  value="success"
                  hide-details
                ></v-checkbox>
                <div style="margin-bottom: 20px; margin-top: 60px">
                  <h2 style="margin-bottom: 8px">Locatie</h2>
                  <v-btn-toggle v-model="name" mandatory dense>
                    <v-btn style="max-width: 160px; min-width: 160px">
                      Adress
                    </v-btn>
                    <v-btn style="max-width: 160px; min-width: 160px">
                      Kantoor
                    </v-btn>
                    <v-btn style="max-width: 160px; min-width: 160px">
                      Online
                    </v-btn>
                  </v-btn-toggle>
                </div>
                <v-text-field
                  v-model="name"
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
 <v-selector
        v-model="firstname"
        :options="namen"
        @search="search" 
      ></v-selector>  
      {{this.namen}}
      <button @click="search">a</button>          </v-col>
          </v-row>
        </v-card>
      </v-dialog>

      <v-sheet height="900">
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
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import VueDatetimeJs from "vue-datetime-js";
import "vue2-datepicker/index.css";
export default {
  components: { datePicker: VueDatetimeJs },
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
    calendarid: null,
    kalendernaam: [],
    kalenderid: [],
    gebruiker: null,
    dialog: false,
    firstname:null,
    namen:[]
  }),
  mounted() {
    this.incrementerDing();
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
    user(user) {
      if (user) {
        this.gebruiker = user.id;
        this.getCalendars();
        this.getAllEvents();
        this.getColor();
      }
    },
    calendarid: function (val) {
      console.log(val);
      this.getEvents();
      this.getColor();
    },
       firstname: function (val) {
      console.log(val);
       this.search();
     },
  },

  methods: {
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

          this.getEvents();
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
    deleteEvent(ev) {
      this.axios
        .delete(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar_Account/0`,
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
            data: {
              id: ev,
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.selectedOpen = false;
          this.getEvents();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    incrementerDing() {
      this.getalletje++;
    },
    search() {
      this.axios
        .post(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar_Search/0`,
          {
            firstname: this.firstname,
          },
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          for (var j=0; j<res.data.length; j++){
            this.namen.push(res.data[j].firstname);
          console.log("events: " + this.namen);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getAllEvents() {
      this.axios
        .post(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar_Getall/0`,
          {
            id: this.gebruiker,
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
          this.colors = "blue";
          console.log("events: " + this.events);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getEvents() {
      this.axios
        .post(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar_Account/0`,
          {
            calendarid: this.calendarid,
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
          console.log("events: " + this.events);
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
            calendarid: this.calendarid,
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
    getCalendars() {
      console.log(this.gebruiker);
      this.axios
        .post(
          `http://localhost/Kyano-Backend-Calendar/v1/Calendar_User/0`,
          {
            id: this.gebruiker,
          },
          {
            headers: {
              Authorization: `user ${this.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            this.kalendernaam.push(res.data[i].calendar_name);
            this.kalenderid.push(res.data[i].calendar);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor() {
      return this.colors;
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
@media (max-width: 991.98px) {
  #opslaanKnop {
    margin-left: 60px;
  }
}
</style>
