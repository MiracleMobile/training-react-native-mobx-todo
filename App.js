import React, { Component } from 'react';
import {
  Platform,
  Button,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Modal,
  View
} from 'react-native';
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import Store from './Store'

type Props = {};

const ToDoItem = observer(({item}) => {

  const bText = item.done ? 'Done' : 'Verify'
  return (
    <View style={styles.containerParentTodo}>
      <View style={styles.containerTodo}>
        <Button title={bText} onPress={() => item.done = !item.done }/>
        <View style={styles.textTodoParent}>
          <Text style={[styles.textTodo, item.done ? styles.todoDone : null]}>{ item.name }</Text>
        </View>
        <Button title='Delete' color='lightsalmon' onPress={() => item.delete() }/>
      </View>
      <View style={styles.lineStyle} />
    </View>
  );
});

const ToDoListView = observer(({ list }) => {
  return list.map((item, index) => {
    return <ToDoItem item={item} key={item.id}/>
  })
})


@observer
export default class App extends Component<Props> {

  url = 'https://api.myjson.com/bins/h59u6'
  @observable newItem = "";
  @observable loading = false;

  constructor() {
    super()

    this.fetchTodo()
  }

  @action
  async fetchTodo() {
    try {
      this.loading = true
      let resp = await fetch(this.url);
      let json = await resp.json();

      json.data.forEach( item => {
        Store.addTodo(item.name, item.done);
      })

      this.loading = false
    }
    catch(err) {
      console.log(err)
      this.loading = false
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            placeholder="What needs to be done?"
            onChangeText={ (t) => this.newItem = t }
            onSubmitEditing={() => { Store.addTodo(this.newItem); this.newItem = ''; }}
            style={styles.input}
          value={ this.newItem }/>
        </View>
        <ScrollView style={styles.content}>
          <ToDoListView list={Store.List}/>
        </ScrollView>
        <View style={styles.lineStyle} />
        <View style={styles.footer}>
          <Text style={styles.leftText}>{Store.leftTodoCount} Items Left</Text>
          <Button color={ Store.filterMode == 0 ? 'lightsalmon': 'deepskyblue'} title='all' onPress={() => Store.filterMode = 0}/>
          <Button color={ Store.filterMode == 1 ? 'lightsalmon': 'deepskyblue'} title='active' onPress={() => Store.filterMode = 1}/>
          <Button color={ Store.filterMode == 2 ? 'lightsalmon': 'deepskyblue'} title='done' onPress={() => Store.filterMode = 2}/>
        </View>
        <Modal visible={this.loading}>
          <View style={styles.modal}>
            <Text>Loading</Text>
          </View>
        </Modal>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  containerTodo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  containerParentTodo: {
    height: 54
  },
  todoDone: {
    textDecorationLine: 'line-through',
  },
  textTodoParent: {
    marginLeft: 14,
    marginRight: 14,
    width: 220
  },
  textTodo: {
    fontSize: 18
  },
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    borderColor: 'lightgray', borderWidth: 1, height: 48,
    marginLeft: 12, marginTop: 4, marginRight: 12, marginBottom: 4, fontSize: 18,
    padding: 8
  },
  header: {
    height: 54,
    alignSelf: 'stretch',
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white'
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'lightgray',
    opacity: 0.4,
    alignSelf: 'stretch'
  },
  footer: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  leftText: {
    marginLeft: 12,
    marginTop: 12,
    marginRight: 100
  }
});
