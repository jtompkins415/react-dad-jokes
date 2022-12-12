import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";


class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props){
    super(props);
    this.state = {
      jokes: []
    }
    this.genNewJokes = this.genNewJokes.bind(this)
    this.resetVotes = this.resetVotes.bind(this)
    this.toggleLock = this.toggleLock.bind(this)
    this.vote = this.vote.bind(this)
  };

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  async getJokes() {
    try{
      let jokes = this.state.jokes;
      let jokeVotes = JSON.parse(
        window.localStorage.getItem('jokeVotes') || "{}"
      );
      let seenJokes = new Set(jokes.map(j => j.id));

      while (jokes.length < this.props.numJokesToGet){
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: {Accept: "applications/json"}
        });
        let {status, ...joke} = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokeVotes[joke.id] = jokesVotes[joke.id] || 0;
          jokes.push({...joke, votes: jokeVotes[joke.id], locked: false});
        } else {
          console.log('Duplicate joke found');
        }
      }
      
      this.setState({jokes});
      window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes))
    }catch(err){
      console.log(err)
    }
  }

  genNewJokes() {
    this.setState(st => ({jokes: st.jokes.filter(j => j.locked)}));
  }

  resetVotes() {
    window.localStorage.setItem("jokeVotes", "{}");
    this.setState(st => ({
      jokes: st.jokes.map(joke => ({...joke, votes: 0}))
    }));
  }

  vote(id, delta) {
    let jokeVotes = JSOn.parse(window.localStorage.getItem("jokeVotes"));
    jokeVotes[id] = (jokeVotes[id] || 0) + delta;
    window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes));
    this.setState(st => ({
      jokes: st.jokes.map(j => j.id === id ? {...j, votes: j.votes + delta} : j)
    }));
  }

  toggleLock(id) {
    this.setState(st => ({
      jokes: st.jokes.map(j => (j.id === id ? {...j, locked: !j.locked} : j))
    }));
  }

  render() {
    let sortedJokes = [...this.state.jokes].sort((a,b) => b.votes - a.votes);
    let allLocked = sortedJokes.filter(j => j.locked).length === this.props.numJokesToGet;

    return(
      <div className="JokeList">
        <button 
          className="JokeList-getjokes" 
          onClick={this.genNewJokes} 
          disabled={allLocked}
        >
          Get New Jokes
        </button>
        <button className="JokeList-getjokes" onClick={this.resetVotes}>
          Reset Vote Count
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            votes={j.votes}
            vote={this.vote}
            locked={j.locked}
            toggleLock={this.toggleLock} 
          />
        ))}

        {sortedJokes.length < this.props.numJokesToGet ? (
          <div className='loading'>
            <i className="fas fa-4x fa-spinner fa-spin" />
          </div>
        ) : null}
      </div>
    )
  }
}

export default JokeList; 