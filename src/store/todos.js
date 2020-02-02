import * as firebase from "firebase";

export default {
  state: {
    todos: []
  },
  mutations: {
    setTodos: (state, payload) => {
      state.todos = payload;
    },
    addTodo: (state, payload) => {
      if (!payload.id) {
        payload.id = state.todos.length + 1;
      }
      state.todos.push(payload);
    },
    editTodo: (state, { id }) => {
      const editTodo = state.todos.find(todo => todo.id === id);
      editTodo.completed = !editTodo.completed;
    },
    removeTodo: (state, todoId) => {
      const removeTodo = state.todos.find(todo => todo.id === todoId);
      state.todos.splice(state.todos.indexOf(removeTodo), 1);
    }
  },
  actions: {
    async fetchTodos({ commit }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const fbVal = await firebase
          .database()
          .ref("todos")
          .once("value");
        const todos = fbVal.val();

        const resultTodos = [];
        for (let key in todos) {
          resultTodos.push({
            ...todos[key],
            id: key
          });
        }

        commit("setLoading", false);
        commit("setTodos", resultTodos);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async addTodo({ commit }, newTodo) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const todo = await firebase
          .database()
          .ref("todos")
          .push(newTodo);

        commit("setLoading", false);
        commit("addTodo", {
          ...newTodo,
          id: todo.key
        });
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async editTodo({ commit }, { id, completed }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await firebase
          .database()
          .ref("todos")
          .child(id)
          .update({
            completed: !completed
          });

        commit("setLoading", false);
        commit("editTodo", {
          id
        });
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async removeTodo({ commit }, todoId) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await firebase
          .database()
          .ref("todos")
          .child(todoId)
          .remove();

        commit("setLoading", false);
        commit("removeTodo", todoId);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    }
  },
  getters: {
    todos: (state, getters) => {
      if (getters.user) {
        return state.todos.filter(todo => todo.ownerId === getters.user.id);
      } else {
        return state.todos.filter(todo => !todo.ownerId);
      }
    }
  }
};
