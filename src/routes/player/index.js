import { h, Component } from 'preact';
import style from './style';
import shallowCompare from 'shallow-compare';
import { Link } from 'preact-router/match';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import LoadingSpinner from '../../components/loading'

import { makeRound10 } from '../../utilities'

export default class Player extends Component {
	state = {
		currentPlayer:null,
		passerRatingSet:false
	}

	componentDidMount() {
		this.setCurrentPlayer(this.props)
		// Used in the passer rating calculation
		makeRound10()
	}

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

	componentWillReceiveProps(nextProps) {
		this.setCurrentPlayer(nextProps)
	}

	render({ player_id, players, loading }, { currentPlayer }) {
		if (loading || !currentPlayer) { return (<LoadingSpinner />)}
		// Add passer_rating to each game object
		const games = currentPlayer.games.map(game => {
			return Object.assign({}, game, {passer_rating:this.getPasserRating(game)}) 
		})
		return (
			<div class="container h100">
				<div class={`${style.profile} df aic`}>
					<Link href="/players">&larr; Back</Link>
					{currentPlayer.hasOwnProperty('img_url') && (<img src={currentPlayer.img_url} />)}
					<h1 class="f1">{currentPlayer.first_name} {currentPlayer.last_name} - Game Statistics</h1>
				</div>
        <ReactTable
          data={games}
          columns={[
            {
              Header: "Game Info",
              columns: [
                {
                  Header: "Week",
                  accessor: "week",
                  maxWidth: 90
                },
                {
                  Header: "Home Team",
                  accessor: "home_team",
								  Cell: row => (
								    <div style={{
								    	color:row.original.on_home_team ? "#37d461" : "inherit"}}>
								      {row.value}
								    </div>
								  )                  
                },
                {
                  Header: "Away Team",
                  accessor: "away_team",
								  Cell: row => (
								    <div style={{
								    	color:row.original.on_home_team ? "inherit" : "#37d461"}}>
								      {row.value}
								    </div>
								  ),
                  Footer: (
                    <span>
                      <strong>Averages:</strong>
                    </span>
                  ) 
                }                
              ]
            },
            {
              Header: "Player Stats",
              columns: [
                {
                  Header: "Comp",
                  accessor: "completions",
                  maxWidth: 85,
                  Footer: (
                    <span><strong>
                      {this.getAverage(games,'completions')}</strong>
                    </span>
                  )                  
                },
                {
                  Header: "Att",
                  accessor: "attempts",
                  maxWidth: 85,
                  Footer: (
                    <span><strong>
                      {this.getAverage(games,'attempts')}</strong>
                    </span>
                  )                   
                },
                {
                  Header: "Yds",
                  accessor: "yards",
                  maxWidth: 100,
                  Footer: (
                    <span><strong>
                      {this.getAverage(games,'yards')}</strong>
                    </span>
                  ) 
                },
                {
                  Header: "TD",
                  accessor: "touchdowns",
                  maxWidth: 80,
                  Footer: (
                    <span><strong>
                      {this.getAverage(games,'touchdowns')}</strong>
                    </span>
                  ) 
                },
                {
                  Header: "Int",
                  accessor: "interceptions",
                  maxWidth: 80,
                  Footer: (
                    <span><strong>
                      {this.getAverage(games,'interceptions')}</strong>
                    </span>
                  ) 
                },
                {
                  Header: "Rating",
                  accessor: "passer_rating",
                  maxWidth: 100,
                  Footer: (
                    <span><strong>
                      {this.getAverage(games,'passer_rating')}</strong>
                    </span>
                  ) 
                },
              ]
            }
          ]}
          defaultSorted={[
            {
              id: "week",
              desc: true
            }
          ]}
          style={{
            height: "calc(100% - 143px)",
            maxHeight: games.length >= 20 ? 718 : games.length * 33 + 91
          }}
          defaultPageSize={games.length}
          showPagination={false}
          className="-striped -highlight"
        />				
			</div>
		);
	}

	setCurrentPlayer = props => {
		if (!props.loading && !this.state.currentPlayer) {
			const { player_id, players } = props
			this.setState({currentPlayer:this.getCurrentItem(parseInt(player_id), players, 'player_id')})
		}		
	}

	getPasserRating = game => {
		const {attempts, completions, yards, touchdowns, interceptions} = game,
		a = (completions / attempts - .3) * 5,
		b = (yards / attempts - 3) * .25,
		c = (touchdowns / attempts) * 20,
		d = 2.375 - (interceptions / attempts * 25)
		return Math.round10((a + b + c + d) / 6 * 100, -1)
	}

	getAverage = (dataArr, dataKey) => {
		const avg = dataArr.reduce((accum, row) => {
			return accum + row[dataKey]
		},0) / dataArr.length
		return Math.round10(avg, -1)
	}

	getCurrentItem = (idToFind, list, key) => {
		let foundItem = false, i = 0
		while(!foundItem && i < list.length){
			if (list[i][key] === idToFind) {
				foundItem = list[i]
				break
			}else{
				i++
			}
		}
		return foundItem	
	}
}
