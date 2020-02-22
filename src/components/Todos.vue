<template>
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

    <v-flex xs12 sm6 sm3 class="Filters">
      <v-btn
        v-for="button in filterButtons"
        :key="button.text"
        :color="button.color"
        :text="filter !== button.text"
        @click="filterToggle(button.text)"
        :small="isMobile"
        class="filter-button"
      >
        {{ button.text }}
      </v-btn>
    </v-flex>

    <app-loading :loading="loading"></app-loading>

    <v-flex xs12 sm6 sm3 style="max-height: 600px; overflow: auto">
      <v-list three-line nav>
        <v-list-item
          @click="todoToggle(todo)"
          v-for="todo in filteredTodos"
          :key="todo.id"
        >
          <v-list-item-action class="item-action">
            <v-checkbox
              color="secondary"
              :input-value="todo.completed"
            ></v-checkbox>
          </v-list-item-action>

          <v-list-item-content
            :class="{ 'item-content': true, completed: todo.completed }"
          >
            <v-list-item-title class="todo-text">
              {{ todo.text }}
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action class="item-action">
            <v-btn icon ripple @click.stop="removeTodo(todo.id)">
              <v-icon color="grey lighten-1">mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { isMobile } from "../helpers/utlis";

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
      isMobile: isMobile(),
      text: "",
      filter: "all",
      filterButtons: [
        { text: "all", color: "primary" },
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

.filter-button {
  margin: 6px 8px;
}

.filter-button:first-child {
  margin-left: 0px;
}
.filter-button:last-child {
  margin-right: 0px;
}

.item-action {
  align-self: center !important;
}

@media (max-width: 767px) {
  .Filters {
    display: flex;
    justify-content: space-between;
  }

  .filter-button {
    min-width: 80px !important;
  }

  .todo-text {
    font-size: 13px;
    line-height: unset !important;
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
