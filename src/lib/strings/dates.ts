export function getColloquialDate(dateStr: string) {
	const target = new Date(dateStr);

	const date = getDay(target);
	const time = target.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });

	return date + ' at ' + time;
}

//get the difference in days 0 = today 1 = tomorrow

function getDay(target: Date) {
	//get the YYYY-MM-DD in eastern time
	const dateStr = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });
	const targetStr = target.toLocaleDateString('en-US', { timeZone: 'America/New_York' });

	const diff = (new Date(targetStr).getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);

	if (diff === -1) {
		return 'yesterday';
	} else if (diff === 0) {
		return 'today';
	} else if (diff === 1) {
		return 'tomorrow';
	} else if (diff <= 6) {
		//get the text day of week e.g. Monday, Tuesday
		return target.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long' });
	} else {
		return target.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'long', day: 'numeric' });
	}
}
