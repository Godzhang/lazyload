(function(){
	var LazyLoad = function(imgs, options){
		this.imgs = Array.prototype.slice.call(imgs);
		this.opt = Object.assign({}, LazyLoad.DEFAULT, options);
		this.init();
	}
	LazyLoad.DEFAULT = {
		threshold: 0,        //距离container容器视口的临界值
		effect: "show",
		container: document.documentElement || document.body,
		appear: function(){},
		load: function(){},
		placeholder: "images/grey.gif"
	}
	LazyLoad.prototype = {
		init: function(){
			var self = this;

			this.initialHandle();

			window.addEventListener("scroll", function(){
				self.update();
			}, false);
			window.addEventListener("resize", function(){
				self.update();
			});
		},
		initialHandle: function(){
			var self = this;

			this.imgs.forEach(function(img, index){
				if(!img.src && self.inview(img)){
					var src = img.getAttribute("data-src");
					img.src = src;
				}else{
					img.src = self.opt.placeholder;
				}
			});
		},
		update: function(){
			var self = this;

			this.imgs.forEach(function(img, index){
				if(self.inview(img) && img.src.indexOf(self.opt.placeholder) > -1){
					var src = img.getAttribute("data-src");
					img.src = src;
					if(self.opt.effect === 'fadeIn'){
						self.fadeIn(img, 10);
					}
					self.imgs.splice(index, 1);
				}
			});
		},
		setOpacity: function(el, opacity){
			if(el.style.opacity != undefined){
				el.style.opacity = opacity / 100;
			}else{
				el.style.filter = "alpha(opacity=" + opacity + ")";
			}
		},
		fadeTo: function(el, opacity, speed){
			var self = this;

			var v = el.style.filter.replace("alpha(opacity=", "").replace(")", "") || el.style.opacity || 100;
			v < 1 && (v *= 100);
			speed = speed < 1 ? 1 : speed;
			var avg;
			//计算每次改变多少
			if(opacity > v){
				avg = opacity / speed;
			}else if(opacity < v){
				avg = (opacity - v) / speed;
			}else{
				return;
			}
			return {
				v: v,
				avg: avg
			}
		},
		fadeIn: function(el, speed){
			var self = this;
			el.style.display = "block";
			this.setOpacity(el, 0);
			var res = this.fadeTo(el, 100, speed),
				v = res.v,
				avg = res.avg;

			var timer = setInterval(function(){
				if(v < 100){
					v += avg;
				}else{
					v = 100;
					clearInterval(timer);
				}
				self.setOpacity(el, v);
			}, 30);
		},
		fadeOut: function(el, speed){
			var self = this;

			var res = this.fadeTo(el, 0, speed),
				v = res.v,
				avg = res.avg;

			var timer = setInterval(function(){
				if(v > 0){
					v += avg;
					self.setOpacity(el, v);
				}else{
					v = 0;
					self.setOpacity(el, v);
					el.style.display = "none";
					clearInterval(timer);
				}
			}, 30);
		},
		getAttr: function(elem, attr){
			return Number(getComputedStyle(elem)[attr].slice(0, -2));
		},
		inTop: function(elem){
			var top = elem.offsetTop,
				scrollTop = this.opt.container.scrollTop,
				height = this.getAttr(elem, 'height');

			return scrollTop > top + height + this.opt.threshold;
		},
		inLeft: function(elem){
			var left = elem.offsetLeft,
				scrollLeft = this.opt.container.scrollLeft,
				width = this.getAttr(elem, 'width');

			return scrollLeft > left + width + this.opt.threshold;
		},
		inBottom: function(elem){
			var top = elem.offsetTop,
				scrollTop = this.opt.container.scrollTop + this.opt.container.clientHeight;

			return scrollTop + this.opt.threshold <= top;
		},
		inRight: function(elem){
			var left = elem.offsetLeft,
				scrollLeft = this.opt.container.scrollLeft + this.opt.container.clientWidth;

			return scrollLeft + this.opt.threshold <= left;
		},
		inview: function(elem){
			return !this.inTop(elem) && !this.inLeft(elem) && !this.inBottom(elem) && !this.inRight(elem);
		}
	}
	window.LazyLoad = LazyLoad;
})();