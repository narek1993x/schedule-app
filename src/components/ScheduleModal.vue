<template>
  <v-row justify="start" class="ml-2">
    <v-dialog dark v-model="dialog" persistent max-width="800px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" v-on="on">
          Add
          <v-icon right dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create schedule event</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Title*"
                  hint="title of event"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  name="input-7-4"
                  label="Content"
                  value=""
                  hint="content of event"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="startTimer"
                  v-model="startTimerMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="startTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="startTime"
                      label="Start"
                      prepend-icon="mdi-timer"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="startTimerMenu"
                    v-model="startTime"
                    scrollable
                    full-width
                    color="success"
                    :max="endTime"
                    @click:minute="$refs.startTimer.save(startTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="endTimer"
                  v-model="endTimerMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="endTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="endTime"
                      label="End"
                      prepend-icon="mdi-timer"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="endTimerMenu"
                    v-model="endTime"
                    scrollable
                    full-width
                    color="success"
                    :min="startTime"
                    @click:minute="$refs.endTimer.save(endTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    startTimerMenu: false,
    endTimerMenu: false,
    startTime: null,
    endTime: null
  })
};
</script>

<style></style>
