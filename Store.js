import { observable, computed, action } from 'mobx'


class Todo {
    id = Math.random()
    @observable name = 'untitled'
    @observable done = false;

    constructor(name, done, parent) {
        this.name = name;
        this.done = done;
        this.parent = parent
    }

    delete() {
        this.parent.deleteItem(this);
    }
}

class TodoListStore {

    @observable todos = []
    @observable filterMode = 0 // 0: All, Active: 1, Completed: 2

    @action
    addTodo(name, done = false) {
        this.todos.push(new Todo(name, done, this))
    }

    @computed get leftTodoCount() {
        return this.todos.filter( (t) => t.done != true ).length;
    }

    @computed get List() {
        if( this.filterMode == 1 ){
            return this.todos.filter( (t) => t.done != true );
        }
        else if( this.filterMode == 2 ){
            return this.todos.filter( (t) => t.done == true );
        }
        else
            return this.todos;
    }

    @action deleteItem(item) {
        this.List.remove(item);
    }
}

const todoListStore = new TodoListStore()
/*
for(var i = 0;i<1;i++) {
    todoListStore.addTodo('Dinner with Mary')
    todoListStore.addTodo('Pay the credit card')
    todoListStore.addTodo('Swimming at 18:00')
}
*/

export default todoListStore
