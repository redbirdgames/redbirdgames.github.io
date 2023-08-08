window.addEventListener('load', event => {
	const MIN_WIDTH = 560;	

	document.body.classList.add('body_loaded');

	if (window.innerWidth <= MIN_WIDTH) {
		return;
	}

	new Main().start();
});

class Main {

	constructor() {
		this._body = document.body;
		this._footer = document.querySelector('.contact');
		this._timeline = gsap.timeline();
		this._logo = new Logo(this._timeline);
		this._games = new Games(this._timeline);

		this._logo.create();
		this._games.create();
		this._footer.classList.add('contact_hide');
		this._footer.style.transition = 'transform .5s';
	}

	start() {
		this._timeline.add(() => this._onStarted(), 0.5);
	}

	_onStarted() {
		this._logo.show();
		this._games.show();
		this._timeline.add(() => this._footer.classList.remove('contact_hide'));
	}

}

class Logo {

	constructor(timeline) {
		this._timeline = timeline;
		this._logo = document.querySelector('.logo');
		this._leftImg = this._logo.children[0];
		this._rightImg = this._logo.children[1];
		this._DELAY_BEFORE_FLY = 0.8;
		this._LOGO_FLY_DURATION = 0.8;
		this._TRANSLATE_DURATION = 0.8;
		this._TRANSLATE_DELAY = 0.5;
	}

	create() {
		this._logo.style.top = '50%';
		this._logo.style.width = '323px';
		this._leftImg.style.transform = 'translate(-100%, -50%)';
		this._rightImg.style.transform = 'translate(20%, -55%)';
	}

	show() {
		const duration = this._timeline.duration();

		this._timeline.to(this._leftImg, 
			{ duration: this._TRANSLATE_DURATION, transform: 'translate(-61%, -50%)' },
			duration + this._TRANSLATE_DELAY
		);
		this._timeline.to(this._rightImg, 
			{ duration: this._TRANSLATE_DURATION, transform: 'translate(-20%, -55%)' },
			duration + this._TRANSLATE_DELAY
		);
		this._timeline.add(() => {
			this._leftImg.style.transform = 'translate(-61%, -50%)';
			this._rightImg.style.transform = 'translate(-20%, -55%)';
		});
		this._timeline.add(() => {
			this._rightImg.style.animation = 'fly 0.5s linear';
		});
		this._timeline.to(this._logo, {
			duration: this._LOGO_FLY_DURATION, 
			width: '150px',
			top: '7%'
		}, `+=${this._DELAY_BEFORE_FLY}`);
		this._timeline.add(() => {
			this._rightImg.style.animation = 'fly 2.5s linear infinite';
		});
	}

}

class Games {

	constructor(timeline) {
		this._timeline = timeline;
		this._list = document.querySelector('.games');
		this._FADE_DURATION = 0.7;
	}

	create() {
		for (let index = 0; index < this._list.children.length; index++) {
			const game = this._list.children[index];
			game.style.opacity = 0;
			game.style.transform = `translateX(${index * -100}%)`;
			game.style.zIndex = `${this._list.children.length - index}`;
		}
	}

	show() {
		const duration = this._timeline.duration();

		for (let index = 0; index < this._list.children.length; index++) {
			const item = this._list.children[index];

			this._timeline.add(() => {
				item.style.transition = `opacity ${this._FADE_DURATION * (index + 1)}s`;
				item.style.opacity = 1;
			}, duration);
			this._timeline.to(item,
				{ 
					duration: this._FADE_DURATION * index, 
					transform: 'translateX(0)'
				},
				duration
			);
		};
		// this._timeline.set({}, {}, `+=${this._FADE_DURATION * (this._list.children.length - 1)}`);
	}

}