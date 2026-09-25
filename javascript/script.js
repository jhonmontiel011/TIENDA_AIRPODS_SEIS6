(() => {

  'use strict';

  const NUMERO_WHATSAPP = '573002275371';

  const raiz = document.documentElement;
  raiz.classList.add('js');

  const reducirMovimiento =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tieneHover =
    window.matchMedia('(hover: hover)').matches;


  document.querySelectorAll('[data-wa]').forEach((el) => {

    const mensaje = encodeURIComponent(el.dataset.wa);

    el.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;

    el.target = '_blank';
    el.rel = 'noopener';

  });


  const barra = document.getElementById('barra');

  const alScroll = () => {

    if (barra) {
      barra.classList.toggle(
        'barra--fija',
        window.scrollY > 24
      );
    }

  };

  alScroll();

  window.addEventListener(
    'scroll',
    alScroll,
    { passive: true }
  );


  const menu = document.getElementById('menu');

  if (menu) {

    menu.querySelectorAll('a').forEach((enlace) => {

      enlace.addEventListener('click', () => {

        if (
          menu.classList.contains('show') &&
          window.bootstrap
        ) {

          window.bootstrap.Collapse
            .getOrCreateInstance(menu)
            .hide();

        }

      });

    });

  }


  const pista = document.querySelector('.pista');

  if (pista) {
    pista.innerHTML += pista.innerHTML;
  }


  const revelables = document.querySelectorAll('.rev');

  if ('IntersectionObserver' in window) {

    const observador = new IntersectionObserver(
      (entradas) => {

        entradas.forEach((entrada) => {

          if (entrada.isIntersecting) {

            entrada.target.classList.add('visible');

            observador.unobserve(entrada.target);

          }

        });

      },
      {
        threshold: 0.15
      }
    );

    revelables.forEach((el) => {
      observador.observe(el);
    });

  } else {

    revelables.forEach((el) => {
      el.classList.add('visible');
    });

  }


  const animarContador = (el) => {

    const meta = Number(el.dataset.meta);

    if (reducirMovimiento) {

      el.textContent =
        meta.toLocaleString('es-CO');

      return;

    }

    const duracion = 1600;

    const inicio = performance.now();

    const paso = (ahora) => {

      const t = Math.min(
        (ahora - inicio) / duracion,
        1
      );

      const suave =
        1 - Math.pow(1 - t, 4);

      el.textContent =
        Math.round(meta * suave)
          .toLocaleString('es-CO');

      if (t < 1) {
        requestAnimationFrame(paso);
      }

    };

    requestAnimationFrame(paso);

  };


  const contadores =
    document.querySelectorAll('[data-meta]');


  if ('IntersectionObserver' in window) {

    const obsContadores =
      new IntersectionObserver(
        (entradas) => {

          entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

              animarContador(entrada.target);

              obsContadores.unobserve(
                entrada.target
              );

            }

          });

        },
        {
          threshold: 0.6
        }
      );

    contadores.forEach((el) => {
      obsContadores.observe(el);
    });

  } else {

    contadores.forEach(animarContador);

  }


  const escena =
    document.querySelector('.escena');

  if (
    escena &&
    tieneHover &&
    !reducirMovimiento
  ) {

    const piezas =
      escena.querySelectorAll('.flot');

    const zona =
      document.getElementById('inicio');

    if (zona) {

      zona.addEventListener(
        'mousemove',
        (e) => {

          const caja =
            escena.getBoundingClientRect();

          const dx =
            (
              e.clientX -
              (
                caja.left +
                caja.width / 2
              )
            ) / caja.width;

          const dy =
            (
              e.clientY -
              (
                caja.top +
                caja.height / 2
              )
            ) / caja.height;


          piezas.forEach((pieza) => {

            const prof =
              Number(pieza.dataset.prof) || 10;

            pieza.style.setProperty(
              '--px',
              (-dx * prof * 2).toFixed(1)
            );

            pieza.style.setProperty(
              '--py',
              (-dy * prof * 2).toFixed(1)
            );

          });

        }
      );


      zona.addEventListener(
        'mouseleave',
        () => {

          piezas.forEach((pieza) => {

            pieza.style.setProperty(
              '--px',
              0
            );

            pieza.style.setProperty(
              '--py',
              0
            );

          });

        }
      );

    }

  }


  if (
    tieneHover &&
    !reducirMovimiento
  ) {

    document
      .querySelectorAll('.mod-img')
      .forEach((caja) => {

        caja.addEventListener(
          'mousemove',
          (e) => {

            const r =
              caja.getBoundingClientRect();

            const x =
              (
                e.clientX - r.left
              ) / r.width - 0.5;

            const y =
              (
                e.clientY - r.top
              ) / r.height - 0.5;


            caja.style.transform =
              `perspective(900px) ` +
              `rotateY(${(x * 14).toFixed(1)}deg) ` +
              `rotateX(${(-y * 14).toFixed(1)}deg)`;

          }
        );


        caja.addEventListener(
          'mouseleave',
          () => {

            caja.style.transform = '';

          }
        );

      });

  }


  const voces =
    Array.from(
      document.querySelectorAll('.voz')
    );

  const contPuntos =
    document.getElementById('puntos');

  const contVoces =
    document.getElementById('voces');


  if (
    voces.length &&
    contPuntos &&
    contVoces
  ) {

    let actual = 0;

    let temporizador;


    const puntos =
      voces.map((_, i) => {

        const b =
          document.createElement('button');

        b.type = 'button';

        b.setAttribute(
          'aria-label',
          `Ver opinión ${i + 1}`
        );


        b.addEventListener(
          'click',
          () => {

            mostrar(i);

            reiniciar();

          }
        );


        contPuntos.appendChild(b);

        return b;

      });


    contPuntos.removeAttribute(
      'aria-hidden'
    );


    function mostrar(i) {

      actual = i;


      voces.forEach((v, n) => {

        v.classList.toggle(
          'activa',
          n === i
        );

      });


      puntos.forEach((p, n) => {

        p.classList.toggle(
          'activa',
          n === i
        );

      });

    }


    function reiniciar() {

      clearInterval(temporizador);


      if (!reducirMovimiento) {

        temporizador =
          setInterval(
            () => {

              mostrar(
                (actual + 1) % voces.length
              );

            },
            5500
          );

      }

    }


    contVoces.addEventListener(
      'mouseenter',
      () => clearInterval(temporizador)
    );


    contVoces.addEventListener(
      'mouseleave',
      reiniciar
    );


    mostrar(0);

    reiniciar();

  }


  const anio =
    document.getElementById('anio');

  if (anio) {

    anio.textContent =
      new Date().getFullYear();

  }

})();