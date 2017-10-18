(function(window){
	var echo = {};

	var callback = function(){};

	var offset, poll, delay, debounce;

	var isHidden = function(elem){
		return (elem.offsetParent === null);
	}

	var inView = function(elem, view){
		if(isHidden(elem)){
			return false;
		}
		var box = elem.getBoundingClientRect();
		return (box.top <= view.b && box.left <= view.r && box.bottom >= view.t && box.right >= view.l);
	}

	var debounceOrThrottle = function(){
		if(!debounce && !!poll){
			return;
		}
		clearTimeout(poll);
		poll = setTimeout(function(){
			echo.render();
			poll = null;
		}, delay);
	}

	echo.init = function(opts){
		opts = opts || {};
		var offsetAll = opts.offset || 0;
		var offsetVertical = opts.offsetVertical || offsetAll;
		var offsetHorizontal = opts.offsetHorizontal || offsetAll;
		var optionToInt = function(opt, fallback){
			return parseInt(opt || fallback, 10);
		};
		offset = {
			t: optionToInt(opts.offsetTop, offsetVertical),
			b: optionToInt(opts.offsetBottom, offsetVertical),
			l: optionToInt(opts.offsetLeft, offsetHorizontal),
			r: optionToInt(opts.offsetRight, offsetHorizontal)
		};
		delay = optionToInt(opts.throttle, 250);
		debounce = opts.debounce !== false;
		callback = opts.callback || callback;
		echo.render();
		if(document.addEventListener){
			window.addEventListener('scroll', debounceOrThrottle, false);
			window.addEventListener('load', debounceOrThrottle, false);
		}else{
			window.attachEvent('onscroll', debounceOrThrottle);
			window.attachEvent('onload', debounceOrThrottle);
		}
	};

	echo.render = function(context){
		var nodes = (context || document).querySelectorAll('[data-echo]');
		var length = nodes.length;
		var src, elem;
		var view = {
			l: 0 - offset.l,
			t: 0 - offset.t,
			b: (window.innerHeight || document.documentElement.clientHeight) + offset.b,
			r: (window.innerWidth || document.documentElement.clientWidth) + offset.r
		}
		for(var i = 0; i < length; i++){
			elem = nodes[i];
			if(inView(elem, view)){
				if(elem.src !== (src = elem.getAttribute('data-echo'))){
					elem.src = src;
				}
				elem.removeAttribute('data-echo');

				callback(elem);
			}
		}
		if(!length){
			echo.detach();
		}
	}

	echo.detach = function(){
		if(document.removeEventListener){
			window.removeEventListener('scroll', debounceOrThrottle);
		}else{
			window.detachEvent('onscroll', debounceOrThrottle);
		}
		clearTimeout(poll);
	};

	window.echo = echo;

})(window);