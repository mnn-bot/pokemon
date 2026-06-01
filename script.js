const timeAzulDiv = document.getElementById("timeAzul");
const timeVermelhoDiv = document.getElementById("timeVermelho");
const pontosAzulEl = document.getElementById("pontosAzul");
const pontosVermelhoEl = document.getElementById("pontosVermelho");
const resultadoEl = document.getElementById("resultado");
const sortearBtn = document.getElementById("sortearBtn");
const modoClaro = document.getElementById("modoclaro");
const quantidadePorTime = 6;
const maxPokemon = 1025; // variaveis futuras

sortearBtn.addEventListener("click", iniciarBatalha);

async function iniciarBatalha() {
    limparTela();

    resultadoEl.textContent = "Carregando Pokémon...";

    const timeAzul = await criarTime();
    const timeVermelho = await criarTime();

    const pontosAzul = calcularPontuacao(timeAzul);
    const pontosVermelho = calcularPontuacao(timeVermelho);

    renderizarTime(timeAzul, timeAzulDiv, "azul");
    renderizarTime(timeVermelho, timeVermelhoDiv, "vermelho");

    pontosAzulEl.textContent = `${pontosAzul} pontos`;
    pontosVermelhoEl.textContent = `${pontosVermelho} pontos`;

    compararTimes(pontosAzul, pontosVermelho);
}

async function buscarPokemon(id) {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const dados = await resposta.json();

    return {
        nome: dados.name,
        imagem: dados.sprites.other["official-artwork"].front_default,
        tipos: dados.types.map(item => item.type.name),
        hp: dados.stats[0].base_stat,
        ataque: dados.stats[1].base_stat,
        defesa: dados.stats[2].base_stat,
        ataquesp: dados.stats[3].base_stat,
        defesasp: dados.stats[4].base_stat,                
        velocidade: dados.stats[5].base_stat
    };
}

// vamos continuar daqui quarta-feira.

async function criarTime(){
    const time = []; // sempre que iniciar o jogo nao tem nada
    const idsUsados = new Set(); // pega os ids gerados, e tira algum que repita, deixando 2 times de 6, sem repetir nenhum.

    while (time.length < quantidadePorTime) { //repetiçao: ate cada time ter 6, ele nao para
        const id = gerarNumeroAletorio(1, maxPokemon);

        if (!idsUsados.has(id)) {
            idsUsados.add(id);
            const pokemon = await buscarPokemon(id)
            time.push(pokemon);
        }
    }

    return time;
}

function calcularPontuacao(time){

    let total = 0;

    time.forEach(pokemon => {
        total += pokemon.hp;
        total += pokemon.ataque;
        total += pokemon.defesa;
        total += pokemon.ataquesp
        total += pokemon.defesasp;
        total += pokemon.velocidade;
    });
    return total;
}

function renderizarTime(time, elemento, cor){
    time.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("card", cor);

        card.innerHTML = `
        <img src="${pokemon.imagem}" alt= "${pokemon.nome}">
        <h3>${pokemon.nome}</h3>

        <div>
        ${pokemon.tipos.map(tipo => `<span class="tipo">${tipo}</span>`).join("")}
        </div>

        <p>HP: ${pokemon.hp} </p>
        <p>Ataque: ${pokemon.ataque} </p>
        <p>Defesa: ${pokemon.defesa} </p>
        <p>Ataque-SP: ${pokemon.ataquesp} </p>
        <p>Defesa-SP: ${pokemon.defesasp} </p>
        <p>Velocidade: ${pokemon.velocidade} </p>
        <p><strong>Total: ${pokemon.hp + pokemon.ataque + pokemon.defesa + pokemon.ataquesp + pokemon.defesasp +pokemon.velocidade}</strong> </p>
        `;

        elemento.appendChild(card);
    });

}

function compararTimes(pontosAzul, pontosVermelho){
    resultadoEl.className = "";

    if (pontosAzul > pontosVermelho){
        resultadoEl.textContent = "Time Azul venceu";
        resultadoEl.classList.add("vencedor");

    } else if (pontosVermelho > pontosAzul){
        resultadoEl.textContent = "Time Vermelho venceu";
        resultadoEl.classList.add("vencedor");

    } else {
        resultadoEl.textContent = "Empate!";
        resultadoEl.classList.add("empate");
    }
}

function gerarNumeroAletorio(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function limparTela(){
    timeAzulDiv.innerHTML = "";
    timeVermelhoDiv.innerHTML = "";
    pontosAzulEl.textContent = "0 pontos";
    pontosVermelhoEl.textContent = "0 pontos";
    resultadoEl.textContent = "";
    resultadoEl.className = "";
}

modoClaro.addEventListener("click", () => {
    if(document.body.classList.contains("modo-claro")){
        document.body.classList.remove("modo-claro");
        modoClaro.textContent = "modo claro";
    } else{
        document.body.classList.add("modo-claro");
        modoClaro.textContent = "modo escuro";
    }
});