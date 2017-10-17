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
		},
		initialHandle: function(){
			var self = this;

			this.imgs.forEach(function(img, index){
				if(self.inview(img)){
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
				if(self.inBottom(img) || self.inRight(img)){					
					var src = img.getAttribute("data-src");
					img.src = src;
				}
			});
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