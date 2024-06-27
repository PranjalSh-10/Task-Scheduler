import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
    this.API_URL = "http://localhost:5038/";
  }

  componentDidMount() {
    this.refreshNotes();
  }

  async refreshNotes() {
    try {
      const response = await fetch(this.API_URL + "api/Sampledb/GetNotes");
      const data = await response.json();
      this.setState({ notes: data });
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }

  async addClick() {
    try {
      const newNotes = document.getElementById("newNotes").value;
      const data = new FormData();
      data.append("newNotes", newNotes);

      const response = await fetch(this.API_URL + "api/Sampledb/AddNotes", {
        method: "POST",
        body: data
      });
      const result = await response.json();
      alert(result);
      this.refreshNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  async deleteClick(id) {
    try {
      const response = await fetch(`${this.API_URL}api/Sampledb/DeleteNotes?id=${id}`, {
        method: "DELETE"
      });
  
      if (response.ok) {
        alert("Note deleted successfully");
        this.refreshNotes();
      } else {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Error deleting note");
    }
  }

  render() {
    const { notes } = this.state;
    return (
      <div className="App">
        <h2>SampleApp</h2>
        <input id="newNotes" placeholder="Enter new note"  />&nbsp;
        <button onClick={() => this.addClick()}>Add Notes</button>
        {notes.map(note =>
          <p key={note._id}>
            <b>*{note.desc}</b>&nbsp;
            <button onClick={() => this.deleteClick(note._id)}>Delete Notes</button>
          </p>
        )}
      </div>
    );
  }
}

export default App;