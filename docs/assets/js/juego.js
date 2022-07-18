const miModulo = (() => { // start Patron modulo

    'use strict'

    let deck            = [], // 'C', 'D', 'H', 'S', 
        puntosJugadores = [];
    const tipos      = ['C', 'D', 'H', 'S'],
          especiales = [ 'A', 'J', 'Q', 'K'];
        
    // Referencias HTML
    const btnNuevo   = document.querySelector('#btnNuevo'),
          btnPedir   = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener');
    
    const divCartasJugadores  = document.querySelectorAll('.divCartas'),
          puntosHtml = document.querySelectorAll('small');
    
    const inicializarJuego = ( numJugadores = 2) => {
        deck = crearDeck();

        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHtml.forEach(elem => elem.innerText = 0);

        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    const crearDeck = () => {
        
        deck = [];

        for (let i = 2; i <=10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
    
        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push( especial + tipo );
            }
        }
        return _.shuffle( deck );
    }
        
    const pedirCarta = () => {
        
        if (deck.length === 0) {
            throw 'No hay cartas en el Deck';
        }
        return deck.pop();
    }
        
    const valorCarta = (carta) => {    
        const valor = carta.substring(0, carta.length - 1);
        return ( isNaN( valor ) ) ? 
               (valor === 'A') ? 11 : 10
               : valor * 1;
    }
    
    // Turno: 0 = primer Jugador y el ultimo = Computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHtml[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta); 
    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
    
            if ( puntosMinimos === puntosComputadora){
                alert('Esto es un empate!');
            } else if (puntosMinimos > 21) {
                alert('Gana la computadora');
            } else if (puntosComputadora > 21) {
                alert('Jugador gana!!');
            } else {
                alert('La computadora ha ganado!!');
            }
        
       }, 100);
    }

    // Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        
        let puntosComputadora = 0;
       do {
    
            const carta = pedirCarta();
            puntosComputadora =  acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
    
       } while ( ( puntosComputadora < puntosMinimos ) && ( puntosMinimos <=21 ));

       determinarGanador();
    
    }
    
    // Eventos
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);
    
        if (puntosJugador >21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        } else if ( puntosJugadores[0] === 21 ){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });
    
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;
    
        turnoComputadora(puntosJugadores[0]);
    });
    
    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });    

    return {
        nuevoJuego: inicializarJuego
    };

})(); // end Patron modulo