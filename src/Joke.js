import React, {Component} from "react";
import "./Joke.css";

class Joke extends Component {
  constructor(props){
    super(props);
    this.upVote = this.upVote.bind(this)
    this.downVote = this.downVote.bind(this)
    this.toggleLock = this.toggleLock.bind(this)
  }
  
  upVote() {
    this.props.vote(this.props.id, +1)
  }

  downVote() {
    this.props.vote(this.props.id, -1)
  };

  toggleLock() {
    this.props.toggleLock(this.props.id);
  }

  render(){
    return (
      <div className={`Joke ${this.props.locked ? "Joke-locked" : ""}`}>
        <div className="Joke-votebox">
          <button onClick={this.upVote}>Like</button>
          <button onClick={this.downVote}>Dislike</button>
          <button onClick={this.toggleLock}>Lock Joke</button>
          {this.props.votes}
        </div>
        <div className="Joke-textarea">{this.props.text}</div>
      </div>
    )
  }
}

export default Joke;

