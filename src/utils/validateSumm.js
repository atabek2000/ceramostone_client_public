export default (text) => {
	let val = text.replaceAll(/[^0-9.]/g, '');
	if (val.indexOf(".") != '-1') {
		val = val.substring(0, val.indexOf(".") + 3);
	} 
	val = val.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ' ');
	return val;
}
