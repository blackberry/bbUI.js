bb.activityIndicator = {
	
	apply: function(elements) {
		var i,
			outerElement,
			innerElement,
			indicator, 
			color = bb.screen.controlColor,
			res,
			size,
			width;
			
		if (bb.device.isBB10) {
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires';

			for (i = 0; i < elements.length; i++)  {
				outerElement = elements[i];
				size = (outerElement.hasAttribute('data-bb-size')) ? outerElement.getAttribute('data-bb-size').toLowerCase() : 'medium';
				
				if (size == 'large') {
					width = (bb.device.isPlayBook) ? '93px' : '184px';
				} else if (size == 'small') {
					width = (bb.device.isPlayBook) ? '21px' : '41px';
				} else {
					size = 'medium';
					width = (bb.device.isPlayBook) ? '46px' : '93px';
				}
				
				outerElement.style.width = width;
				// Add another div so that the developers styling on the original div is left untouched
				indicator = document.createElement('div');
				indicator.setAttribute('class',  'bb-bb10-activity-margin-'+res+' bb-bb10-activity-'+size+'-'+res+' bb-bb10-activity-'+color);
				outerElement.appendChild(indicator);
				innerElement = document.createElement('div');
				innerElement.setAttribute('class','bb-bb10-activity-'+size+'-'+res+' bb-bb10-activity-inner');
				indicator.appendChild(innerElement);
				// Set our animation
				innerElement.style['-webkit-animation-name'] = 'activity-rotate';
				innerElement.style['-webkit-animation-duration'] = '0.8s';
				innerElement.style['-webkit-animation-iteration-count'] = 'infinite';
				innerElement.style['-webkit-animation-timing-function'] = 'linear';
			}
		}
	}


}