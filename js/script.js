const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const background = document.querySelector('body') 

const score = document.querySelector('#score') 
score.innerHTML = localStorage.getItem('score')

// Variáveis da imagem da nave
const nave = new Nave(canvas); 


// Variáveis dos tiros
const tiroWidth = 2;
const tiroHeight = 10;
const tiros = [];

// Variáveis das estrelas
const estrelas = [];

// Variáveis do jogo
let vidas = 3;
let jogoAtivo = true

// Variáveis dos asteroides
const asteroides = [];
const asteroideImages = [];
const asteroideWidth = 50;
const asteroideHeight = 60;
let asteroideSpeed = 5;
let asteroidesDeath = 0

// Carregar imagens dos asteroides
const asteroide1 = new Image();
asteroide1.src = "https://pt.seaicons.com/wp-content/uploads/2015/07/asteroid-icon.png"; 
asteroideImages.push(asteroide1);

// Carregar imagens dos asteroides
const asteroide2 = new Image();
asteroide2.src = "https://www.pngall.com/wp-content/uploads/12/Asteroid-Meteor-PNG-Clipart.png"
asteroideImages.push(asteroide2);


// Função para criar asteroides aleatórios"; 
function criarAsteroide() {
    if(!jogoAtivo)return
    const asteroideX = Math.random() * (canvas.width - asteroideWidth);
    const asteroideY = (0 - asteroideHeight / 2);
    const asteroideImage = asteroideImages[Math.floor(Math.random() * asteroideImages.length)];
    asteroides.push({ x: asteroideX, y: asteroideY, image: asteroideImage });
}

// Função para desenhar asteroides
function drawAsteroides() {
    for (let i = 0; i < asteroides.length; i++) {
        ctx.drawImage(asteroides[i].image, asteroides[i].x, asteroides[i].y, asteroideWidth, asteroideHeight);
    }
}

// Função para criar estrelas aleatórias
function criarEstrela() {
    if(!jogoAtivo)return 0
    const estrelaX = Math.random() * canvas.width;
    const estrelaY = 0;
    const estrelaSpeed = Math.random() * 3 + 1;
    estrelas.push({ x: estrelaX, y: estrelaY, speed: estrelaSpeed });
}

// Função para desenhar as estrelas
function drawEstrelas() {
    ctx.fillStyle = "white";
    for (let i = 0; i < estrelas.length; i++) {
        ctx.fillRect(estrelas[i].x, estrelas[i].y, 2, 2); // Estrelas como pequenos quadrados brancos
    }
}


// Função para desenhar os tiros
function drawTiros() {
    ctx.fillStyle = "white";
    for (let i = 0; i < tiros.length; i++) {
        ctx.fillRect(tiros[i].x, tiros[i].y, tiroWidth, tiroHeight);
    }
}

// Função para atualizar o jogo
function updateGameArea() {

    // O jogo acabou, exiba a tela de "Game Over"
    if (jogoAtivo == false) {
        fimDeJogo()
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Desenha os componentes
    drawEstrelas();
    drawTiros();
    nave.draw(ctx);
    drawAsteroides();


    // Atualiza a posição da nave se estiver se movendo
    if (naveMovingLeft && nave.x > - nave.width) {
        nave.x -= nave.speed;
    }
    if (naveMovingRight && nave.x < canvas.width) {
        nave.x += nave.speed;
    }

    // Atualiza a posição das estrelas
    for (let i = 0; i < estrelas.length; i++) {
        estrelas[i].y += estrelas[i].speed;
        if (estrelas[i].y > canvas.height) {
            estrelas.splice(i, 1); // Remove estrelas que saíram da tela
        }
    }

  // Atualiza a posição dos asteroides
    for (let i = 0; i < asteroides.length; i++) {
        asteroides[i].y += asteroideSpeed;

        // Verifica colisão entre os asteroides e as balas
        for (let j = 0; j < tiros.length; j++) {
            if (
                tiros[j].x < asteroides[i].x + asteroideWidth &&
                tiros[j].x + tiroWidth > asteroides[i].x &&
                tiros[j].y < asteroides[i].y + asteroideHeight &&
                tiros[j].y + tiroHeight > asteroides[i].y
            ) {
                // Colisão entre asteroide e bala, remova ambos
                asteroides.splice(i, 1);
                tiros.splice(j, 1);
                asteroidesDeath += 1; // Exemplo de aumento de quilômetros
            }
        }

        // A nave perde uma vida se o asteroide atingir a parte inferior do canvas
        if (asteroides[i].y > canvas.height) {
            asteroides.splice(i, 1);
            vidas--; 
        }
    }

    // Fim do jogo, o jogador não tem mais vidas
    if (vidas <= 0) {
        jogoAtivo = false;
    } 

    // Aumentando Velocidade Do Asteroide
    switch(asteroidesDeath){
        case(0): 
            background.style.backgroundColor = '#1388cc'
            asteroideSpeed = 5
            break
        case(10): 
            background.style.backgroundColor = 'orange'
            asteroideSpeed = 7
            break
        case(20): 
            background.style.backgroundColor = '#5a5959'
            asteroideSpeed = 9
            break
        case(30): 
            background.style.backgroundColor = '#242222'
            asteroideSpeed = 10
            break
    }

    // Exibe informações na tela
    ctx.font = "14px Arial";
    ctx.fillStyle = "white"
    ctx.drawImage(nave.image, 20, 10, 30, 30);
    ctx.fillText(`x ${vidas}`, 50, 30);

    // Exibe informações na tela
    ctx.font = "14px Arial";
    ctx.fillStyle = "white"
    ctx.drawImage(asteroideImages[0], 20, 40, 30, 30);
    ctx.fillText(`x ${asteroidesDeath}`, 50, 60);
}



// Event listeners para controlar a nave
let naveMovingLeft = false;
let naveMovingRight = false;


document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === 'a') {
        naveMovingLeft = true;
    }
    if (event.key === "ArrowRight" || event.key === 'd') {
        naveMovingRight = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft" || event.key === 'a') {
        naveMovingLeft = false;
    }
    if (event.key === "ArrowRight" || event.key === 'd') {
        naveMovingRight = false;
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Space" || event.keyCode === 32) {
        jogoAtivo = true
    }
});


// Tela Fim Do Jogo
function fimDeJogo(){
    var p = parseInt(localStorage.getItem('score'))
    if(asteroidesDeath > p){
        atualizarScore(asteroidesDeath)
    }
    vidas = 3
    asteroidesDeath = 0
    nave.x = (canvas.width - nave.width) / 2;

    removerAsteroides();

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 15);
    ctx.font = "12px Arial";
    ctx.fillText("Press space", canvas.width / 2 - 32, canvas.height / 2);
}



// Event listener para disparar tiros
function criarTiro() {
    const tiroX = nave.x + nave.width / 2 - tiroWidth / 2;
    const tiroY = nave.y;
    tiros.push({ x: tiroX, y: tiroY });
};



// Função para atualizar a posição dos tiros
function updateTiros() {
    for (let i = 0; i < tiros.length; i++) {
        tiros[i].y -= 5; // Mova os tiros para cima
        if (tiros[i].y < 0) {
            // Remova tiros que saíram da tela
            tiros.splice(i, 1);
        }
    }
}

function removerAsteroides() {
    asteroides.length = 0; // Isso esvazia o array de asteroides
}

function atualizarScore(pontos){
    localStorage.setItem('score', pontos)
    score.innerHTML = localStorage.getItem('score')
}


// Função para criar estrelas a intervalos regulares
setInterval(criarEstrela, 500);

// Função para criar asteroides a intervalos regulares
setInterval(criarAsteroide, 2000); // Exemplo de intervalo de criação de asteroides

// Atirar
setInterval(criarTiro, 200);


// Iniciar o jogo
setInterval(function () { 
    updateGameArea();
    updateTiros();
}, 20); // Atualiza o jogo a cada 20 milissegundos
