let navMain = document.querySelector('.mobile-nav');
let navToggle = document.querySelector('.mobile-nav__toggle');

navMain.classList.remove('mobile-nav--nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('mobile-nav--closed')) {
    navMain.classList.remove('mobile-nav--closed');
    navMain.classList.add('mobile-nav--opened');
  } else {
    navMain.classList.add('mobile-nav--closed');
    navMain.classList.remove('mobile-nav--opened');
  }
});
