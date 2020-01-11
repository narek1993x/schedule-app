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
          class="filter-button"
        >
        {{ button.text }}
        </v-btn>
      </v-flex>

      <app-loading :loading="loading"></app-loading>

      <v-flex xs12 sm6 sm3 style="max-height: 600px; overflow: auto">
        <v-list three-line>
          <v-list-tile @click="todoToggle(todo)" v-for="todo in filteredTodos" :key="todo.id">
            <v-list-tile-action class="item-action">
              <v-checkbox
                :input-value="todo.completed"
              ></v-checkbox>
            </v-list-tile-action>

            <v-list-tile-content :class="{'item-content': true, 'completed': todo.completed}">
              <v-list-tile-title class="todo-text">{{todo.text}}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action class="item-action">
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

.todo-text {
  overflow: initial !important;
  text-overflow: initial !important;
  white-space: initial !important;
  height: auto !important;
}

@media (max-width: 767px) {
  .todo-text {
    font-size: 13px;
    line-height: unset !important;
  }

  .filter-button {
    font-size: 12px !important;
    padding: 0 5px !important;
    min-width: 80px !important;
  }

  .v-list__tile {
    padding: 0 10px !important;
  }

  .item-content {
    padding: 0 5px !important;
  }

  .item-action {
    min-width: 24px !important;
  }
}
</style>
