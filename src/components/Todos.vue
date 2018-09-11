<template>
  <v-container>
    <v-layout column justify-center style="max-width: 600px; margin: auto;">
      <v-flex xs12 sm6 sm3>
        <v-text-field
          label="Add your todo"
          type="text"
          clearable
          @keyup.enter="addTodo"
          v-model="text"              
        ></v-text-field>
      </v-flex>

      <v-flex xs12 sm6 sm3>
        <v-btn 
          v-for="button in filterButtons" 
          :key="button.text"
          :color="button.color"
          :flat="filter !== button.text"
          @click="filterToggle(button.text)"
        >
        {{ button.text }}
        </v-btn>
      </v-flex>

      <v-flex xs12 :class="['text-xs-center pt-5', { backdrop: loading }]" v-if="loading">
        <v-progress-circular
            class="loading"
            :size="100"
            :width="4"
            color="primary"
            indeterminate
        ></v-progress-circular>
      </v-flex>

      <v-flex xs12 sm6 sm3 style="max-height: 600px; overflow: auto">
        <v-list>
          <v-list-tile @click="todoToggle(todo)" v-for="todo in filteredTodos" :key="todo.id">
            <v-list-tile-action>
              <v-checkbox 
                :input-value="todo.completed"
              ></v-checkbox>
            </v-list-tile-action>

            <v-list-tile-content :class="{'completed': todo.completed}">
              <v-list-tile-title>{{todo.text}}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple @click.stop="removeTodo(todo.id)">
                <v-icon color="grey lighten-1">delete</v-icon>
              </v-btn>
          </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user;
    },
    methodToggle() {
      return this.$store.getters.isUserLoggedIn ? "dispatch" : "commit";
    },
    todos() {
      return this.$store.getters.todos;
    },
    filteredTodos() {
      switch (this.filter) {
        case "active":
          return this.todos.filter(i => !i.completed);
        case "completed":
          return this.todos.filter(i => i.completed);
        default:
          return this.todos;
      }
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  data() {
    return {
      text: "",
      filter: "all",
      filterButtons: [
        { text: "all" },
        { text: "active", color: "success" },
        { text: "completed", color: "info" }
      ]
    };
  },
  methods: {
    addTodo() {
      if (!this.text) return;

      const todo = {
        text: this.text,
        completed: false,
        ...(this.user ? { ownerId: this.user.id } : {})
      };
      this.$store[this.methodToggle]("addTodo", todo);
      this.text = "";
    },
    todoToggle({ id, completed }) {
      this.$store[this.methodToggle]("editTodo", { id, completed });
    },
    removeTodo(todoId) {
      this.$store[this.methodToggle]("removeTodo", todoId);
    },
    filterToggle(filter) {
      this.filter = filter;
    }
  }
};
</script>

<style>
.completed {
  text-decoration: line-through;
  color: grey;
}

.backdrop {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.loading {
  position: fixed;
  z-index: 500;
  transition: all 0.3s ease-out;
  top: 25%;
  left: 48%;
}
</style>
