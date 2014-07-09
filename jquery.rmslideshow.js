/*!
 * rmslideshow v1.1.0 (http://redmorado.com/)
 * Copyright 2013-2014 redmorado
 */
;(function($, window, document, undefined){
	'use strict';

	// --------------------------------
	// ---- jQuery setting
	// --------------------------------

	if(!$.easing.rmEaseOutExpo){
		$.easing.rmEaseOutExpo = function(x, t, b, c, d){
			return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
		};
	}



	// --------------------------------
	// ---- Create the defaults once
	// --------------------------------

	var pluginName = "rmslideshow",
		defaults = {
			width: 930,
			height: 300,
			target: null,
			currentTargetClass: 'current',
			data_type: 'html',
			data_source: '',
			animation_type: 'fade',
			animation_duration: 1000,
			animation_delay: 10000,
			enable_flick: true,
			navigator: null,
			indicator: '',
			indicatorInterface: '',
			progressCallback: null,
			changedCallback: null,
			animatedCallback: null

			// feature
			//
		};

	function Plugin(element, options) {
		this.element = element;
		this._defaults = $.extend(defaults, {target: $(element).children()});
		this.settings = $.extend( {}, this._defaults, options );
		this._name = pluginName;

		// インスタンス化する際に代入しないと他のインスタンスと共有してしまう
		this.callback = {};
		this.sync = {};

		this.init();
	}

	Plugin.prototype = {


		// --------------------------------
		// ---- define variable
		// --------------------------------

		$parent: null,
		$target: null,
		$indicators: null,
		$indicatorInterface: null,
		$hero: null,
		$animating: null,
		callback: {},
		baseTime: null,
		timerId: null,
		touchStartX: 0,
		sync: {},




		// --------------------------------
		// ---- functions
		// --------------------------------

		/**
		 * initialize function
		 */
		init: function () {

			// --------------------------------
			// ---- define variable
			// --------------------------------

			this.$parent = $(this.element);
			this.$target = this.settings.target;
			this.$hero = this.$target.eq(0);
			this.callback = {
					progress: $.Callbacks().add(this.settings.progressCallback),
					changed: $.Callbacks().add(this.settings.changedCallback),
					animated: $.Callbacks().add(this.settings.animatedCallback)
				};

			// --------------------------------
			// ---- execute!
			// --------------------------------

			if(this.settings.data_type !== 'html') {
				this.readyElementsData();
			} else{
				this.startSlideShow();
			}
		},


		startSlideShow: function(){

			// setting elements
			this.initElements();

			// initialize to prev and next navigator
			this.initNavigator();

			// initialize to indicator
			this.initIndicator();

			// animation
			this.requestStartTimer();
		},


		initElements: function(){
			var _this = this;

			// set style
			this.$target.css({
				position: 'absolute',
				display: 'block',
				zIndex: 10
			});

			if(this.settings.enable_flick){
				this.$target.on({
					'touchstart': function(event){ _this.onFlickStart.call(_this, event); },
					'touchend': function(event){ _this.onFlickEnd.call(_this, event); }
				});
			}

			// set style for first elm
			this.$hero.css({
				zIndex: 11
			});

			// set class
			this.setTargetClass();
		},

		/**
		 * for data_type is not 'html'
		 */
		readyElementsData: function(){
			var _this = this;

			// get data from ajax
			if(this.is('String', this.settings.data_source)){
				$.get(this.settings.data_source, '', function(xml){
					var data = [];
					$(xml).find('data').each(function(k, v){
						var $v = $(v);
						data.push({
							src: $v.attr('src'),
							url: $v.attr('url'),
							alt: $v.attr('alt'),
							target: $v.attr('window')
						});
					});
					_this.createElements(data);
				});
			} else if(this.is('Array', this.settings.data_source)){
				this.createElements(this.settings.data_source);
			}
		},


		createElements: function(data){
			var _this = this;
			this.$parent.empty();

			$.each(data, function(k, v){
				var $node = v.url ? $('<div><a><img/></a></div>') : $('<div><img/></div>');

				if(v.url){
					$node.find('a').attr({
						href: v.url,
						target: v.target
					});
				}

				$node.find('img').attr({
					src: v.src,
					alt: v.alt
				});

				_this.$parent.append($node);
			});

			this.$target = this.$parent.children();
			this.$hero = this.$target.eq(0);

			// set class
			this.setTargetClass();

			// execute!
			this.startSlideShow();
		},

		/**
		 * request start timer
		 */
		requestStartTimer: function(){
			if(this.settings.animation_delay > 0){
				this.startTimer();
			}
		},

		/**
		 * start and restart timer
		 */
		startTimer: function(){
			if(!this.baseTime) this.baseTime = new Date().getTime();

			var _this = this;
			var current = new Date().getTime();

			this.callback.progress.fire(this.$target.index(this.$hero), current - this.baseTime, this.settings.animation_delay);

			if(this.baseTime + this.settings.animation_delay <= current){
				this.stopTimer();
				this.toNext();
			} else{
				this.timerId = setTimeout(function(){
					_this.startTimer.call(_this);
				}, 10);
			}
		},

		stopTimer: function(){
			if(this.timerId){
				clearTimeout(this.timerId);
			}
			this.timerId = null;
			this.baseTime = null;
		},


		startAnimation: function(to, reverse){
			var _this = this;

			// stop timer
			this.stopTimer();
			this.finishAnimation();
			this.sync.animation = 0;

			this.$animating = this.$target.eq(to);

			// set class
			this.setTargetClass();

			// style for next elm
			this.$animating.css(this.getStyles('before', 'next', reverse ? 'reverse' : ''));
			this.$hero.css(this.getStyles('before', 'hero', reverse ? 'reverse' : ''));

			// start animation
			this.$animating.animate(this.getStyles('animating', 'next', reverse ? 'reverse' : ''), this.settings.animation_duration, 'rmEaseOutExpo', function(){_this.synchronizer('animation', 2, _this.endAnimation)});
			this.$hero.animate(this.getStyles('animating', 'hero', reverse ? 'reverse' : ''), this.settings.animation_duration, 'rmEaseOutExpo', function(){_this.synchronizer('animation', 2, _this.endAnimation)});

			// changed callback
			this.callback.changed.fire(to, this.$target.index(this.$hero));
		},


		endAnimation: function(){

			this.finishAnimation();

			// animated callback
			this.callback.animated.fire(this.$target.index(this.$hero));

			// next animation timer
			this.requestStartTimer();
		},


		finishAnimation: function(){
			if(!this.$animating) return;

			var $prev = this.$hero;
			this.$hero = this.$animating;

			this.$hero.stop();
			$prev.stop();

			// style after animation
			$prev.css(this.getStyles('after', 'prev'));
			this.$hero.css(this.getStyles('after', 'hero'));
		},


		skipAnimation: function(){

			// style for next elm
			this.$animating.stop().css(this.getStyles('after', 'hero'));
			this.$hero.stop().css(this.getStyles('after', 'prev'));

			this.$hero = this.$animating;
		},


		initNavigator: function(){
			if(!this.settings.navigator) return;

			var _this = this,
				$prev = $(this.settings.navigator.prev),
				$next = $(this.settings.navigator.next);

			$prev.bind('click', function(event){
				_this.toPrev();
				event.preventDefault();
			});
			$next.bind('click', function(event){
				_this.toNext();
				event.preventDefault();
			});
		},


		toPrev: function(){
			var to = this.$target.index(this.$animating || this.$hero) - 1;
			this.startAnimation(to < 0 ? this.$target.length - 1 : to, true);
		},


		toNext: function(){
			var to = this.$target.index(this.$animating || this.$hero) + 1;
			this.startAnimation(to >= this.$target.length ? 0 : to);
		},


		initIndicator: function(){
			if(!this.settings.indicator) return;

			var _this = this;

			this.$indicators = $(this.settings.indicator);
			this.$indicatorInterface = this.settings.indicatorInterface ? $(this.settings.indicatorInterface) : null;


			this.$indicators.bind('click', function(event){
				_this.toClickedIndicator.call(_this, this);
				event.preventDefault();
			});

			// set class
			this.setTargetClass();
		},


		toClickedIndicator: function(elm){
			var to = this.$indicators.index($(elm));
			if(this.$target.index(this.$animating || this.$hero) !== to){
				this.startAnimation(to);
			} else{
				if(this.$animating !== this.$hero){
					this.skipAnimation();
				}
				this.stopTimer();
				this.requestStartTimer();
			}
		},


		onFlickStart: function(event){
			this.touchStartX = event.originalEvent.changedTouches[0].pageX;
			event.preventDefault();
		},


		onFlickEnd: function(event){
			var x = event.originalEvent.changedTouches[0].pageX;
			if(this.touchStartX > x + 40){
				this.toNext();
			} else if(this.touchStartX < x - 40) {
				this.toPrev();
			}
			event.preventDefault();
		},


		/**
		 * return style of every animation_type
		 * @returns {object} jquery style set
		 */
		getStyles: function(){
			var timing = arguments[0],
				target = arguments[1],
				option = arguments[2];
			if(this.settings.animation_type === 'fade'){
				if(timing === 'before' && target === 'next'){
					return {
						zIndex: 12,
						opacity: 0
					}
				}
				if(timing === 'animating' && target === 'next'){
					return {
						opacity: 1
					}
				}
				if(timing === 'after' && target === 'prev'){
					return {
						zIndex: 10,
						opacity: 1
					}
				}
				if(timing === 'after' && target === 'hero'){
					return {
						zIndex: 11,
						opacity: 1
					}
				}
			} else if(this.settings.animation_type === 'over-slide'){
				if(timing === 'before' && target === 'next'){
					if(option === 'reverse'){
						return {
							zIndex: 11,
							left: 0
						}
					} else{
						return {
							zIndex: 12,
							left: this.settings.width
						}
					}
				}
				if(timing === 'before' && target === 'hero'){
					if(option === 'reverse'){
						return {
							zIndex: 12
						}
					}
				}
				if(timing === 'animating' && target === 'next'){
					if(option === 'reverse'){
						return {}
					} else {
						return {
							left: 0
						}
					}
				}
				if(timing === 'animating' && target === 'hero'){
					if(option === 'reverse'){
						return {
							left: this.settings.width
						}
					}
				}
				if(timing === 'after' && target === 'prev'){
					if(option === 'reverse'){
						return {
							zIndex: 10,
							left: 0
						}
					} else {
						return {
							zIndex: 10
						}
					}
				}
				if(timing === 'after' && target === 'hero'){
					if(option === 'reverse'){
						return {}
					} else{
						return {
							zIndex: 11,
							left: 0
						}
					}
				}
			} else if(this.settings.animation_type === 'slide'){
				if(timing === 'before' && target === 'next'){
					if(option === 'reverse'){
						return {
							zIndex: 11,
							left: -this.settings.width
						}
					} else{
						return {
							zIndex: 11,
							left: this.settings.width
						}
					}
				}
				if(timing === 'before' && target === 'hero'){
					return {
						zIndex: 11
					}
				}
				if(timing === 'animating' && target === 'next'){
					return {
						left: 0
					}
				}
				if(timing === 'animating' && target === 'hero'){
					if(option === 'reverse'){
						return {
							left: this.settings.width
						}
					} else{
						return {
							left: -this.settings.width
						}
					}
				}
				if(timing === 'after' && target === 'prev'){
					return {
						zIndex: 10,
						left: 0
					}
				}
				if(timing === 'after' && target === 'hero'){
					return {
						left: 0
					}
				}
			}
			return {};
		},

		/**
		 * set target class name
		 */
		setTargetClass: function(){
			this.$target.removeClass(this.settings.currentTargetClass);
			(this.$animating || this.$hero).addClass(this.settings.currentTargetClass);

			if(this.$indicators){
				var $interfaces = this.$indicatorInterface ? this.$indicatorInterface : this.$indicators;
				$interfaces.removeClass(this.settings.currentTargetClass);
				$interfaces.eq(this.$target.index(this.$animating || this.$hero)).addClass(this.settings.currentTargetClass);
			}
		},




		// --------------------------------
		// ---- utility functions
		// --------------------------------

		/**
		 * is type
		 * @param type
		 * @param obj
		 * @returns {boolean}
		 */
		is: function(type, obj) {
			var clas = Object.prototype.toString.call(obj).slice(8, -1);
			return obj !== undefined && obj !== null && clas === type;
		},

		/**
		 * synchronizer
		 * @param id
		 * @param count
		 * @param callback
		 */
		synchronizer: function(id, count, callback){
			if(this.sync[id] === undefined) this.sync[id] = 0;
			this.sync[id]++;
			if(this.sync[id] < count) return;

			this.sync[id] = 0;
			callback.call(this);
		},




		// --------------------------------
		// ---- public functions
		// --------------------------------

		/**
		 * reset to before start
		 */
		reset: function() {
			this.stopTimer();

			if(this.settings.data_type !== 'html'){
				this.$target.remove();
			} else{
				this.$hero.stop().css(this.getStyles('after', 'prev'));
				if(this.$animating) this.$animating.stop().css(this.getStyles('after', 'prev'));
				this.$target.removeClass(this.settings.currentTargetClass);
			}

			$(this.settings.navigator.prev).unbind();
			$(this.settings.navigator.next).unbind();

			if(this.$indicators){
				this.$indicators.unbind();
				var $interfaces = this.$indicatorInterface ? this.$indicatorInterface : this.$indicators;
				$interfaces.removeClass(this.settings.currentTargetClass);
			}

			this.$parent.removeData('plugin_' + pluginName);
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);