var LIB_FOLDER = '../../lib/',
	_bbUI_overlayWebView,
    _bbUI_clientWebView_Handle,
	_clientWebView;
	

qnx.webplatform.getController().addEventListener('webview.initialized', function (clientWebView) {
	_bbUI_clientWebView_Handle = clientWebView;
	_clientWebView = require(LIB_FOLDER+'webview');
});

qnx.webplatform.getController().addEventListener('overlayWebView.initialized', function () {
	_bbUI_overlayWebView = require(LIB_FOLDER+'overlayWebView');
});

/*
 * API for use from client code, this is the entry point to the controller/backend code
 * across the XHR bridge, these methods can be called by way of the client.js file in
 * the extension
 */
module.exports = {
    initContext : function (success, fail, args) {
		args = JSON.parse(decodeURIComponent(args['value']));
		
		// Create our solid color image for the context peek menu
		var canvas = document.createElement('canvas'),
			ctx,
			dataURL;
		canvas.setAttribute('height','1000px');
		canvas.setAttribute('width', '1000px');
		ctx = canvas.getContext('2d');		
		ctx.fillStyle = args.highlightColor;
		ctx.fillRect(0,0,1000,1000);
		dataURL = canvas.toDataURL();
		
		var js = "if (document.styleSheets && document.styleSheets.length) { " +
				"	var sheet = document.styleSheets[0], "+
				"		rules = sheet.rules;"+
				"	sheet.insertRule('.fullContextmenuItem {background-color:" + args.highlightColor + "}', rules.length -1);" +
				"	sheet.insertRule(\".showContextmenuItem {border-image-source:none;border-image-source:url('"+dataURL+"');}\", rules.length -1);"+
				"}";
		// Apply our new styles
		_bbUI_overlayWebView.executeJavascript(js);
		
		if (navigator.userAgent.toLowerCase().indexOf('version/10.0.9') >= 0) {
			// Assign old event to call later
			_bbUI_overlayWebView.oldNotifyContextMenuCancelled = _bbUI_overlayWebView.notifyContextMenuCancelled;
			
			// Handle event for callback
			_bbUI_overlayWebView.notifyContextMenuCancelled = function() {
				var js = "evt = document.createEvent('Events');"+
						"evt.initEvent('bbui.contextClosed', true, true);"+
						"document.dispatchEvent(evt);";
				_clientWebView.executeJavascript(js);
				
				// Call the old existing event
				_bbUI_overlayWebView.oldNotifyContextMenuCancelled();
			}
		} else {
			// Assign old event to call later
			_bbUI_clientWebView_Handle.oldNotifyContextMenuCancelled = _bbUI_clientWebView_Handle.notifyContextMenuCancelled;
		
			// Handle event for callback
			_bbUI_clientWebView_Handle.notifyContextMenuCancelled = function() {
				var js = "evt = document.createEvent('Events');"+
						"evt.initEvent('bbui.contextClosed', true, true);"+
						"document.dispatchEvent(evt);";
				_clientWebView.executeJavascript(js);
				
				// Call the old existing event
				_bbUI_clientWebView_Handle.oldNotifyContextMenuCancelled();
			}
		}
    }
};