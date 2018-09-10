import * as firebase from 'firebase'

export default {
  state: {
    todos: []
  },
  mutations: {
    setTodos: (state, payload) => {
      state.todos = payload;
    },
    addTodo: (state, payload) => {
      state.todos.push(payload)
    },
    editTodo: (state, todoId) => {
      const editTodo = state.todos.find(todo => todo.id === todoId);
      editTodo.completed = !editTodo.completed;
    },
    removeTodo: (state, todoId) => {
      const removeTodo = state.todos.find(todo => todo.id === todoId);
      state.todos.splice(state.todos.indexOf(removeTodo), 1);
    }
  },
  actions: {
    async fetchTodos({
      commit
    }) {
      commit('setLoading', true);

      try {
        const fbVal = await firebase.database().ref('todos').once('value')
        const todos = fbVal.val();

        const resultTodos = [];
        for (let key in todos) {
          resultTodos.push({
            ...todos[key],
            id: key
          })
        }

        commit('setLoading', false)
        commit('setTodos', resultTodos);
      } catch (error) {
        commit('setLoading', false);
        throw error
      }
    },
    async addTodo({
      commit
    }, newTodo) {
      commit('setLoading', true);

      try {
        const todo = await firebase.database().ref('todos').push(newTodo);

        commit('setLoading', false)
        commit('addTodo', {
          ...newTodo,
          id: todo.key
        });
      } catch (error) {
        commit('setLoading', false);
        throw error
      }
    },
    async editTodo({
      commit
    }, {
      id,
      completed
    }) {
      commit('setLoading', true);

      try {
        await firebase.database().ref('todos').child(id).update({
          completed: !completed
        });

        commit('setLoading', false)
        commit('editTodo', id)
      } catch (error) {
        commit('setLoading', false);
        throw error
      }
    },
    async removeTodo({
      commit
    }, todoId) {
      commit('setLoading', true);

      try {
        await firebase.database().ref('todos').child(todoId).remove();

        commit('setLoading', false)
        commit('removeTodo', todoId);
      } catch (error) {
        commit('setLoading', false);
        throw error
      }
    }
  },
  getters: {
    todos: state => state.todos
  }
};
