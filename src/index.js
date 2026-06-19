document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  const main = document.querySelector("main");
  console.log(main);

  // Элементы полосок бургера для анимации в крестик
  const line1 = document.getElementById("burgerLine1");
  const line2 = document.getElementById("burgerLine2");
  const line3 = document.getElementById("burgerLine3");

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
      // Проверяем, открыто ли меню сейчас
      const isOpen = mobileMenu.classList.contains("opacity-100");

      if (isOpen) {
        // ЗАКРЫВАЕМ МЕНЮ
        mobileMenu.classList.remove(
          "opacity-100",
          "pointer-events-auto",
          "translate-y-0",
        );
        mobileMenu.classList.add(
          "opacity-0",
          "pointer-events-none",
          "-translate-y-2",
        );

        main.classList.remove("opacity-20", "blur-sm");

        // Возвращаем бургер в исходное состояние
        line1.classList.remove("rotate-45", "translate-y-2");
        line2.classList.remove("opacity-0");
        line3.classList.remove("-rotate-45", "-translate-y-2");
      } else {
        main.classList.add("opacity-20", "blur-sm");

        mobileMenu.classList.remove(
          "opacity-0",
          "pointer-events-none",
          "-translate-y-2",
        );
        mobileMenu.classList.add(
          "opacity-100",
          "pointer-events-auto",
          "translate-y-0",
        );

        // Превращаем три полоски в крестик (точные значения подгоняются под space-y)
        line1.classList.add("rotate-45", "translate-y-2");
        line2.classList.add("opacity-0");
        line3.classList.add("-rotate-45", "-translate-y-2");
      }
    });

    // Дополнительно: закрываем меню, если кликнули вне его области
    document.addEventListener("click", (event) => {
      if (
        !burgerBtn.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        mobileMenu.classList.remove(
          "opacity-100",
          "pointer-events-auto",
          "translate-y-0",
        );
        mobileMenu.classList.add(
          "opacity-0",
          "pointer-events-none",
          "-translate-y-2",
        );
        line1.classList.remove("rotate-45", "translate-y-2");
        line2.classList.remove("opacity-0");
        line3.classList.remove("-rotate-45", "-translate-y-2");

        main.classList.remove("opacity-20", "blur-sm");
      }
    });
  }

  const datePickerElement = document.getElementById("rangeDatePicker");

  //ocupados
  const bookedDates = [
    { from: "25/06/2026", to: "28/06/2026" },
    { from: "17/07/2026", to: "20/07/2026" },
  ];

  if (datePickerElement) {
    const calcContainer = document.getElementById("calcContainer");
    const pricePerNight = calcContainer
      ? Number(calcContainer.dataset.price)
      : 0;

    if (calcContainer) {
      const basePriceSpan = document.getElementById("basePrice");
      if (basePriceSpan) basePriceSpan.innerText = pricePerNight;
    }

    flatpickr(datePickerElement, {
      mode: "range",
      minDate: "today",
      dateFormat: "d/m/Y",
      locale: flatpickr.l10ns.es,
      showMonths: 2,
      animate: true,

      onChange: function (selectedDates, dateStr, instance) {
        if (!calcContainer) return;

        const statusText = document.getElementById("statusText");
        const nightsCount = document.getElementById("nightsCount");
        const totalPrice = document.getElementById("totalPrice");
        const reservarBtn = document.getElementById("reservar-btn");

        if (selectedDates.length === 2) {
          const checkIn = selectedDates[0];
          const checkOut = selectedDates[1];

          const timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
          const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));


          if (nightsCount) nightsCount.innerText = nights;

          let isOcupado = false;
          bookedDates.forEach((range) => {
            const bFrom = instance.parseDate(range.from, "d/m/Y");
            const bTo = instance.parseDate(range.to, "d/m/Y");
            if (checkIn <= bTo && checkOut >= bFrom) {
              isOcupado = true;
            }
          });

          if (isOcupado) {
            statusText.innerText = "OCUPADO";
            statusText.className =
              "text-red-500 font-main font-light text-[36px] capitalize leading-[110%] uppercase";
            totalPrice.innerText = "-";
            reservarBtn.disabled=true;
          } else {
            statusText.innerText = "DISPONIBLE";
            statusText.className =
              "text-[#b45309] font-main font-light text-[36px]  capitalize leading-[110%] uppercase";

            totalPrice.innerText = nights * pricePerNight;
            reservarBtn.disabled=false;
          }
        } else {
          // Сброс значений, если даты не выбраны полностью
          if (statusText) {
            statusText.innerText = "SELECCIONE FECHAS";
            statusText.className =
              "text-[#78716c] font-main font-light text-[18px] text-[#fafaf9] capitalize leading-[110%] uppercase";
          }
          if (nightsCount) nightsCount.innerText = "0";
          if (totalPrice) totalPrice.innerText = "0";
        }
      },
    });
  }

  const thumbsElement = document.querySelector(".thumbDetailSwiper");
  const mainSliderElement = document.querySelector(".mainDetailSwiper");

  // 2. Инициализируем только если ОБА элемента существуют в HTML
  if (thumbsElement && mainSliderElement) {
    // Слайдер №1: Лента миниатюр (снизу)
    const galleryThumbs = new Swiper(thumbsElement, {
      spaceBetween: 20, // Расстояние между превьюшками
      slidesPerView: 3, // Сколько миниатюр видно одновременно
      // freeMode: true,             // Слайды можно плавно скроллить руками
      watchSlidesProgress: true, // Важно для синхронизации активного класса
      watchSlidesVisibility: true,
      centerInsufficientSlides: true,

      // Адаптивность для количества миниатюр в зависимости от экрана
      breakpoints: {
        320: {
          slidesPerView: 2, // На экранах от 480px показываем 4 штуки
        },
        769: {
          slidesPerView: 3, // На экранах от 480px показываем 4 штуки
        },
      },
      on: {
        slideChange: function (swiper) {
          galleryMain.slideTo(swiper.activeIndex);
        },
      },
    });

    // Слайдер №2: Главное большое фото (сверху)
    const galleryMain = new Swiper(mainSliderElement, {
      spaceBetween: 10,
      effect: "slide", // Стандартный эффект сдвига (листания)
      speed: 400, // Скорость сдвига в миллисекундах

      // navigation: {
      //   nextEl: ".swiper-button-next",
      //   prevEl: ".swiper-button-prev",
      // },

      // Привязываем нижние миниатюры к главному слайдеру
      thumbs: {
        swiper: galleryThumbs, // Передаем переменную нижнего слайдера
      },
      on: {
        slideChange: function (swiper) {
          galleryThumbs.slideTo(swiper.activeIndex);
        },
      },
    });

    // galleryMain.controller.control = galleryThumbs;
    //   galleryMain.controller.control = galleryThumbs;
    // galleryThumbs.controller.control = galleryMain;
  }
});
