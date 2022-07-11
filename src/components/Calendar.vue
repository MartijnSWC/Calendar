<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
                    {{kalendernaam}}
          <v-btn @click="dialog = true">+</v-btn>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Vandaag
          </v-btn>
          <v-btn fabr text small color="grey darken-2" @click="prev">
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
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-container>
            <v-form @submit.prevent="createEvent">
              <v-text-field
                v-model="name"
                type="text"
                label="event name (required)"
              ></v-text-field>
              <v-text-field
                v-model="details"
                type="text"
                label="event details"
              ></v-text-field>
               <v-text-field
                v-model="color"
                type="text"
                label="event color"
              ></v-text-field>
                   <date-picker v-model="begin" lang="nl" type="datetime"  format="YYYY-MM-DD HH:mm:ss"></date-picker>
    <date-picker v-model="einde" lang="nl" type="datetime"  format="YYYY-MM-DD HH:mm:ss"></date-picker>
              <v-btn
                type="submit"
                color="secondary"
                class="mr-4"
                @click.stop="dialog = false"
              >
                Create Event</v-btn
              >
            </v-form>
          </v-container>
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
      import VueDatetimeJs from 'vue-datetime-js'
      import moment from 'moment'
import 'moment/locale/nl'
  import 'vue2-datepicker/index.css';
export default {
      components: { datePicker: VueDatetimeJs

 },
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
    dialog: false,
    getalletje: 0,
    begin: null,
    einde: null,
    calendarsid:1,
    kalendernaam:null
  }),
  mounted() {
    this.incrementerDing();
    moment.locale('nl');
  },
  computed: {
    ...mapGetters({ token: "gettoken" }),
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
    token(token) {
      if (token) {
        this.getEvents();
      }
    },
  },

  methods: {
    createEvent() {
      console.log(this.begin);
      console.log(this.einde);
      console.log(this.color);
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
        .delete(`http://localhost/Kyano-Backend-Calendar/v1/Calendar/0`, {
          headers: {
            Authorization: `user ${this.token}`,
          },
          data: {
            id: ev,
          },
        })
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
    getEvents() {
      this.axios
        .post(`http://localhost/Kyano-Backend-Calendar/v1/Calendar_Account/0`, {
            calendarsid: this.calendarsid
        },
     {
          headers: {
            Authorization: `user ${this.token}`,
          }
        })
        .then((res) => {
          console.log(res.data);
          this.kalendernaam=res.data[1].calendar_name;
                    this.events=res.data;
          console.log("events: " + this.events);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
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

<style></style>
