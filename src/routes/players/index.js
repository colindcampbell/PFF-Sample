import { h, Component } from 'preact';
import style from './style';
import { Link } from 'preact-router/match';

import LoadingSpinner from '../../components/loading'

export default class Players extends Component {
	render({ players, filter, loading }, {}) {
		if (loading) {
			return (<LoadingSpinner />)
		}
		const matchesTextFilter = new RegExp(filter, "i")
		const playerList = players.reduce((accum,player) => {
			const {first_name, last_name, drafted_by} = player
			if (filter === '' || 
				matchesTextFilter.test(`${first_name} ${last_name} ${drafted_by}`)) {
				return accum.concat(
					(<Link class={style.card} href={`/players/${player.player_id}`}>
						<img src={player.img_url}/>
						<div class={style.cardContent}>
							<h2>{`${first_name} ${last_name}`}</h2>
							<p>Born <strong>{player.date_of_birth}</strong></p>
							<p>Drafted by the <strong>{drafted_by}</strong> in <strong>{player.draft_season}</strong></p>
							<p>Selected <strong>#{player.draft_pick}</strong> in Round <strong>{player.draft_round}</strong>, draft type <strong>{player.draft_type}</strong></p>
						</div>
					</Link>))
			}else{
				return accum
			}
		}, [])
		return (
			<div class={`${style.home} container`} >
				<div class={`${style.cardContainer} df ais jcc fww`}>
					{playerList}
				</div>
			</div>
		);
	}
}
