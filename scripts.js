let chaveIA = "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"
let chave = "022af00bbe60a1de1bc69198b11f065b"

async function buscarClima() {
    let cidadeInput = document.querySelector(".input-cidade").value

    if (!cidadeInput) return;

    let cidade = document.querySelector(".input-cidade").value
    let caixa = document.querySelector(".caixa-media")
    let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`
    try {
        let respostaServidor = await fetch(endereco)
        let dadosJson = await respostaServidor.json()

        if (dadosJson.cod === "404") {
            alert("Cidade não encontrada!")
            return;
        }

        caixa.innerHTML = `
        <h2 class="cidade">${dadosJson.name}</h2>
        <p class="temp">${Math.floor(dadosJson.main.temp)}°C</p>
        <img class="icone" src="https://openweathermap.org/img/wn/${dadosJson.weather[0].icon}.png">
        <p class="umidade">Umidade: ${dadosJson.main.humidity}%</p>
        <button class="botao-ia" onclick="pedirSugestaoRoupa()">Sugestao de roupa</button>
        <p class="resposta-ia">Resposta</p>
    `
    } catch (erro) {
        console.log("erro ao buscar o clima ")
    }


    }
function detectaVoz() {
        let reconhecimento = new window.webkitSpeechRecognition()
        reconhecimento.lang = "pt-BR"
        reconhecimento.start()

        reconhecimento.onresult = function (evento) {

            let textoTranscrito = evento.results[0][0].transcript

            let textoSemPonto = textoTranscrito.replace(/\./g, "").trim();

            document.querySelector(".input-cidade").value = textoSemPonto
            buscarClima()
        }

    }
    async function pedirSugestaoRoupa() {
        let temperatura = document.querySelector(".temp").textContent
        let umidade = document.querySelector(".umidade").textContent
        let cidade = document.querySelector(".cidade").textContent

        let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + chaveIA
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [
                    {
                        "role": "user",
                        "content": `me de uma sugestao de qual roupa usar hoje, estou na cidade de: ${cidade}, a temperatura atual e: ${temperatura} e a umidade e de: ${umidade} me de sugestoes em 2 frases curtas, e bem resumidas sem repetir a cidade e nem a temperatura e a umidade`
                    },
                ]

            })


        })
        let dados = await resposta.json()
        document.querySelector(".resposta-ia").innerHTML = dados.choices[0].message.content
        console.log(dados)


    }