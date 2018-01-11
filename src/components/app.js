import { h, Component } from 'preact';
import { Router } from 'preact-router';
import linkState from 'linkstate';

import Header from './header';
import Players from '../routes/players';
import Player from 'async!../routes/player';
import Redirect from './redirect';

import { DEV_QB_API_ENDPOINT } from '../constants/api';
import { populateData } from '../utilities'

export default class App extends Component {
  constructor(props){
    super(props)
    const path = typeof window === "undefined" ? '/' : document.location.pathname
    this.state = {
      loading:true,
      filter:'',
      currentPath:path
    }
  }
  componentDidMount() {
    fetch(DEV_QB_API_ENDPOINT)
    .then(res => res.json())
    .then(data => {
      setTimeout(() => {
        this.populatedPlayers = populateData(data.statistics,data.players,'player_id','games')
        this.setState({loading:false})
      },500)
    })
    .catch(e => {
      // TODO: show error message to user
      console.log(e)
    })
  }  

  render() {
    return (
      <div id="app">
        <Header 
          filter={this.state.filter} 
          onFilterChange={linkState(this,'filter')}
          onClearFilter={() => this.setState({filter:''})}
          loading={this.state.loading} 
          path={this.state.currentPath} />
        <Router onChange={linkState(this,'currentPath','url')}>
          <Players 
            path="/players"
            filter={this.state.filter} 
            loading={this.state.loading} 
            players={this.populatedPlayers} />
          <Player 
            path="/players/:player_id" 
            loading={this.state.loading} 
            players={this.populatedPlayers}/>
          <Redirect path="/" to="/players" />
        </Router>
      </div>
    );
  }

}
