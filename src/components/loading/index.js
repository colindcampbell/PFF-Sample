import { h, Component } from 'preact';
import style from './style'

export const LoadingSpinner = () => (
	<div class="posf" style={{top:56,bottom:0,left:0,right:0,background:"rgba(0,0,0,.5)"}}>
		<div class={style.spinner}>
		  <div class={style.bounce1}></div>
		  <div class={style.bounce2}></div>
		  <div class={style.bounce3}></div>
		</div>
	</div>
)

export default LoadingSpinner