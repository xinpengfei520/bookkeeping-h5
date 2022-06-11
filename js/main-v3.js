function DOMContentLoaded() {
  var pages = {
    food: {
      init: function () {
        this.shelf.prepare();
      },

      shelf: {
        prepare: function () {
          for (i = 1; i <= 13; i++) {
            this.prepareShelf('shelf-' + i);
          }
        },

        prepareShelf: function (shelf) {
          return new Swiper('.swiper-container.' + shelf, {
            slidesPerView: 5,
            spaceBetween: 30,
            grabCursor: true,
            navigation: {
              nextEl: '.swiper-button-next.' + shelf,
              prevEl: '.swiper-button-prev.' + shelf
            },
            on: {
              init: function () {
                $('.' + shelf).removeClass('transparent');
              }
            }
          });
        }
      }
    },

    channel: {
      init: function () {
        new Swiper('.swiper-container.album.album-1', {
          slidesPerView: 7,
          slidesPerGroup: 7,
          spaceBetween: 10,
          grabCursor: true,
          pagination: {
            el: '.swiper-pagination.album-1',
            type: 'fraction'
          },
          navigation: {
            nextEl: '.swiper-button-next.album-1',
            prevEl: '.swiper-button-prev.album-1'
          },
          on: {
            init: function () {
              $('.album-1').removeClass('transparent');
            }
          }
        });

        crossPages.preparePopper($('.boohee-social-medias > a'));
      }
    },

    member: {
      init: function () {
        $(
          '.section-nutritional-privilege li, .section-exclusive-experience .relative'
        ).hover(
          function () {
            $(this).addClass('hover');
          },
          function () {
            $(this).removeClass('hover');
          }
        );
      }
    },

    join: {
      init: $.noop
    },

    index: {
      init: $.noop
    },

    about: {
      init: $.noop
    },

    app: {
      init: $.noop
    },

    cooperation: {
      init: $.noop
    },

    'food-category': {
      init: $.noop
    },

    'food-warehouse': {
      init: $.noop
    },

    jobs: {
      init: $.noop
    },

    'request-cooperation': {
      init: $.noop
    },

    'request-job': {
      init: $.noop
    },

    'search-results': {
      init: $.noop
    }
  };

  var crossPages = {
    prepareSlideshow: function () {
      new Swiper('.slideshow-swiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        loop: true,
        grabCursor: true,
        pagination: {
          el: '.swiper-pagination.bhphitgc',
          clickable: true,
          type: 'bullets'
        },
        navigation: {
          nextEl: '.swiper-button-next.bhphitgc',
          prevEl: '.swiper-button-prev.bhphitgc'
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        }
      });
    },

    preparePopper: function ($target) {
      $target.hover(
        function () {
          $(this).find('.popper').addClass('show');
        },
        function () {
          $(this).find('.popper').removeClass('show');
        }
      );
    },

    prepareFoodSearch: function () {
      var $frmSearchFood = $('.food-database-section');
      $frmSearchFood.submit(e => {
        e.preventDefault();

        // 取值、处理、验证、发送请求等从这里开展...
      });
    }
  };

  return function () {
    pages[$('hr.hide').data('page')].init();

    if (
      ['index', 'app', 'about', 'cooperation'].indexOf(
        $('hr.hide').data('page')
      ) !== -1
    ) {
      crossPages.preparePopper($('.apps > a'));
    }

    if (['join', 'member'].indexOf($('hr.hide').data('page')) !== -1) {
      crossPages.preparePopper($('.btn-follow-boohee-wechat'));
    }

    if (['food', 'channel'].indexOf($('hr.hide').data('page')) !== -1) {
      crossPages.prepareSlideshow();
    }

    if (
      ['index', 'search-results', 'food-warehouse', 'food-category'].indexOf(
        $('hr.hide').data('page')
      ) !== -1
    ) {
      crossPages.prepareFoodSearch();
    }

    crossPages.preparePopper($('footer .socail-medias > a'));
  };
}

$.when($.ready).then(DOMContentLoaded());
