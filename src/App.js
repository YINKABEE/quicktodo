import React, { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import "./App.css";
import { db } from "./config";

function Todo({ todo, index, id, completeTodo, removeTodo, editTodo }) {
  if (todo.deleted) return null;
  console.log(todo.date);
  return (
    <div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.order} - {todo.person} - £{todo.price} -{" "}
      {moment(todo.date*1000).format("ddd Do MMM YYYY")}
      <div>
        <button onClick={() => completeTodo(id, index)}>Done</button>
        <button onClick={() => removeTodo(id, index)}>x</button>
        <button onClick={() => editTodo(id)}>Edit</button>
      </div>
    </div>
  );
}

function TodoForm({
  addTodo
}) {
  const [order, setOrder] = React.useState("");
  const [datePicker, setDatePicker] = React.useState(new Date);
  const [date, setDate] = useState(new Date);
  const [price, setPrice] = React.useState("");
  const [person, setPerson] = React.useState("");

  useEffect(() => {
    let unixDate = moment(datePicker).unix();
    setDate(unixDate);
  }, [datePicker]);

  const handleSubmit = e => {
    console.log("date", date);
    e.preventDefault();
    if (!order) return;
    addTodo({
      order,
      date,
      price,
      person,
      isCompleted: false
    });
    setOrder("");
    setDate(moment().unix());
    setPrice("");
    setPerson("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Order</label>
      <input
        type="text"
        className="input"
        value={order}
        onChange={e => setOrder(e.target.value)}
      />
      <label>Date: </label>
      <DateTimePicker
        onChange={setDatePicker}
        value={datePicker}
        format="d-MM-y h:mma"
      />
      <label className="input">Price £:</label>
      <input
        type="text"
        className="input"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <label>Customer</label>
      <input
        type="text"
        className="input"
        value={person}
        onChange={e => setPerson(e.target.value)}
      />
      <input type="submit" value="Submit" />
    </form>
  );
}

function EditForm({value, submitEdit, id}) {
  // display existing results DONE
  // fix time DONE
  // change value

  console.log("show edit");
  console.log(id, "id");
  const [order, setOrder] = useState(value.order);
  const [datePicker, setDatePicker] = useState(new Date(value.date*1000));
  const [price, setPrice] = useState(value.price);
  const [person, setPerson] = useState(value.person);

  const handleSubmit = e => {
    e.preventDefault();
    if (!order) return;
    submitEdit({
      order,
      date: moment(datePicker).unix(),
      price,
      person,
      isCompleted: false
    }, id);
    setOrder("");
    setPrice("");
    setDatePicker(new Date());
    setPerson("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Order</label>
      <input
        type="text"
        className="input"
        value={order}
        onChange={e => setOrder(e.target.value)}
      />
      <label>Date: </label>
      <DateTimePicker
        onChange={setDatePicker}
        value={datePicker}
        format="d-MM-y h:mma"
      />
      <label className="input">Price £:</label>
      <input
        type="text"
        className="input"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <label>Customer</label>
      <input
        type="text"
        className="input"
        value={person}
        onChange={e => setPerson(e.target.value)}
      />
      <input type="submit" value="Submit" />
    </form>
  );
}

function App() {
  const [todos, setTodos] = React.useState({});
  const [keyNames, setKeyNames] = React.useState([]);
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [editKey, setEditKey] = useState("");

  useEffect(() => {
    db.ref("/todos").orderByChild("date").on("value", querySnapShot => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      let todoItems = { ...data };
      setTodos(todoItems);
      let ids = Object.getOwnPropertyNames(todoItems);
      setKeyNames(ids);
    });
  }, []);

  const editTodo = key => {
    setEditValues(todos[key]);
    setEdit(true);
    setEditKey(key);
  }

  const completeTodo = key => {
    const newTodos = { ...todos };
    newTodos[key].isCompleted = true;
    setTodos(newTodos);
    db.ref("/todos")
      .child(key)
      .update(newTodos[key]);
  };

  const updateTodo = (key, value) => {
    const newTodos = { ...todos };
    newTodos[key] = value;
    setTodos(newTodos);
  };

  const addTodo = value => {
    const newTodos = { ...todos, value };
    setTodos(newTodos);
    db.ref("/todos").push(value);
  };

  const removeTodo = key => {
    const newTodos = { ...todos };
    newTodos[key].deleted = true;
    //delete newTodos[key];
    setTodos(newTodos);
    db.ref("/todos")
      .child(key)
      .update(newTodos[key]);
  };

  const submitEdit = (value, key) => {
    // save to database
    // save to store
    // clear on save and return to other form DONE
    console.log(key, "key for edit");
    setEdit(false);
    const newTodos = {...todos };
    newTodos[key] = value;
    setTodos(newTodos);
    db.ref("/todos")
      .child(key)
      .update(newTodos[key]);
  }

  return (
    <div className="app">
      <div className="todo-list">
        {keyNames.map((key, index) => (
          <Todo
            key={key}
            index={index}
            todo={todos[key]}
            id={key}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
            editTodo={editTodo}
          />
        ))}
        {!edit && <TodoForm
          addTodo={addTodo}
      />}
        {edit && <EditForm value={editValues} id={editKey} submitEdit={submitEdit}/>}
      </div>
    </div>
  );
}

export default App;
