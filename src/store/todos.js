import { todosRef } from "../firebase";

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
    async fetchTodos({ commit, getters }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const fbVal = await todosRef.child(getters.user.id).once("value");
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
    async addTodo({ commit, getters }, newTodo) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const todo = await todosRef.child(getters.user.id).push(newTodo);

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
    async editTodo({ commit, getters }, { id, completed }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await todosRef
          .child(getters.user.id)
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
    async removeTodo({ commit, getters }, todoId) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await todosRef
          .child(getters.user.id)
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
      return state.todos.filter(todo =>
        getters.user ? !!todo.ownerId : !todo.ownerId
      );
    }
  }
};
