export function populateData (populatorArr,populateeArr,populateKey,destinationKey){
	// reduce statistics to an object with player_id as the keys so that you only have to loop once
	const reducedData = populatorArr.reduce((accum,item) => {
		if (accum.hasOwnProperty(item[populateKey])) {
			accum[item[populateKey]] = accum[item[populateKey]].concat(item)
		}else{
			accum[item[populateKey]] = [item]
		}
		return accum
	},{})
	// Add the games array to each player based on the player_id in the new reducedStatistics object
	return populateeArr.reduce((accum,item) => {
		if(!reducedData.hasOwnProperty(item[populateKey])) return accum
		item[destinationKey] = reducedData[item[populateKey]]
		return accum.concat(item)
	},[])
}

export function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // If the value is negative...
  if (value < 0) {
    return -decimalAdjust(type, -value, exp);
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

export function makeRound10(){
	if (!Math.round10) {
	  Math.round10 = function(value, exp) {
	    return decimalAdjust('round', value, exp);
	  };
	}
}