const _MIN_WIDTH = 560;

window.addEventListener('load', event => {
	document.body.classList.add('body_loaded');

	new ContactForm();

	if (window.innerWidth <= _MIN_WIDTH) {
		return;
	}

	new Main().start();
});

class ContactForm {

	constructor() {
		this._DEMONSTRATION_POPUP_TIME = 2;
		this._timeline = gsap.timeline();
		this._form = document.getElementById("my-form");
		this._closeForm = document.querySelector('.form-overlay__btn');
		this._contactUs = document.querySelector('.contact__btn');
		this._status = document.getElementById("my-form-status");

		this._closeForm.addEventListener('click', () => document.body.classList.remove('form-opened'));
		this._contactUs.addEventListener('click', () => document.body.classList.add('form-opened'));
		this._form.addEventListener("submit", this._handleSubmit.bind(this));
	}

	_handleSubmit(event) {
	  event.preventDefault();

	  const data = new FormData(event.target);

	  fetch(event.target.action, {
	    method: this._form.method,
	    body: data,
	    headers: { 'Accept': 'application/json' }
	  }).then(response => {
	    if (response.ok) {
	      this._showStatus("Thanks for your submission!");
	      this._form.reset();
	    } else {
	      response.json().then(data => {
	        if (Object.hasOwn(data, 'errors')) {
	          this._showStatus(data["errors"].map(error => error["message"]).join(", "));
	        } else {
	          this._showStatus("Oops! There was a problem submitting your form");
	        }
	      });
	    }
	  }).catch(error => {
	    this._showStatus("Oops! There was a problem submitting your form");
	  });
	}

	_showStatus(message) {
		this._timeline.kill();
		this._timeline.add(() => {
			this._form.classList.remove('status-visible');
			document.body.classList.remove('form-opened')
		}, this._DEMONSTRATION_POPUP_TIME);
		this._form.classList.add('status-visible');

		this._status.innerHTML = message;
	}

}

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
	}

}
