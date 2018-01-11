import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
  clearFilter(e){
    this.focusInput()
  }
  focusInput(){
    document.getElementById("search-input").focus();
  } 
  render({ filter, onClearFilter, onFilterChange, path, loading }, {}) {
    return (
      <header class={`${style.header}`}>
        <div class="container df aic h100">
          <Link href="/players"><img class={style.logoImg} src={require('../../assets/logo.svg')} alt="Pro Focus Football"/></Link>
          {path === '/players' && !loading ? (<div class={`${style.searchContainer} posr f1 df`}>
            <div class="posr f1" style={{marginLeft:10}}>
              <span 
                onClick={() => this.focusInput()} 
                class={`${style.searchIcon} posa`}>
                &#9906;
              </span>
              <input id="search-input" 
                class={style.input} 
                placeholder="Search" 
                type="text" 
                value={filter} 
                onInput={e => onFilterChange(e)} />
              {filter !== '' && <span onClick={() => onClearFilter()} class={`${style.clearText} posa`}>✕</span>}
            </div>
          </div>) : (<div class="f1"></div>)}
        </div>  
      </header>     
    );
  }
}
