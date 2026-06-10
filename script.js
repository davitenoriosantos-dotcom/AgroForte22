// --- MODO NOTURNO ---
const toggleBtn = document.getElementById('toggle-btn');

toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        toggleBtn.innerText = '🌙 Modo Noturno';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleBtn.innerText = '☀️ Modo Claro';
    }
});

// --- API DE TEMPERATURA EM TEMPO REAL ---
// Utiliza a geolocalização do navegador do usuário
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Chamada para API gratuita Open-Meteo
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
            .then(response => response.json())
            .then(data => {
                const temp = data.current_weather.temperature;
                document.getElementById('temperature').innerText = temp;
                document.getElementById('location').innerText = "Baseado na sua localização atual";
                document.getElementById('weather-desc').innerText = "Condições ideais para monitoramento agrícola.";
            })
            .catch(() => {
                document.getElementById('location').innerText = "Não foi possível carregar o clima.";
            });
    }, () => {
        document.getElementById('location').innerText = "Permissão de localização negada. Mostrando padrão (Brasília).";
        // Padrão Brasília se o usuário não permitir a localização
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=-15.7801&longitude=-47.9292&current_weather=true`)
            .then(res => res.json())
            .then(data => {
                document.getElementById('temperature').innerText = data.current_weather.temperature;
            });
    });
}

// --- ESTRUTURA DOS 5 QUIZZES DO AGRO ---
const quizData = [
    {
        question: "1. Qual o principal objetivo da agricultura sustentável?",
        options: ["Produzir sem se preocupar com o solo", "Preservar recursos ambientais para o futuro", "Usar o máximo de água possível"],
        correct: 1
    },
    {
        question: "2. Qual tecnologia ajuda a monitorar lavouras economizando água e defensivos?",
        options: ["Drones e sensores", "Tratores antigos", "Enxadas manuais"],
        correct: 0
    },
    {
        question: "3. O que é o plantio direto, muito usado no agro forte?",
        options: ["Plantar sem sementes", "Plantar direto na água", "Cultivar sobre os restos da colheita anterior protegendo o solo"],
        correct: 2
    },
    {
        question: "4. Qual a importância das abelhas na agricultura sustentável?",
        options: ["Nenhuma, elas apenas atrapalham", "Polinização, essencial para a reprodução de várias culturas", "Apenas a produção de mel"],
        correct: 1
    },
    {
        question: "5. O que define a agricultura de precisão?",
        options: ["Gerenciar a lavoura metro a metro usando dados e tecnologia", "Plantar tudo no mesmo dia", "Adivinhar o clima sem usar dados"],
        correct: 0
    }
];

const quizContainer = document.getElementById('quiz-container');

// Renderizar perguntas na tela
quizData.forEach((item, index) => {
    const quizItem = document.createElement('div');
    quizItem.classList.add('quiz-item');
    
    let optionsHtml = '';
    item.options.forEach((option, oIdx) => {
        optionsHtml += `
            <label>
                <input type="radio" name="question${index}" value="${oIdx}">
                ${option}
            </label>
        `;
    });

    quizItem.innerHTML = `
        <p>${item.question}</p>
        <div class="quiz-options">${optionsHtml}</div>
    `;
    quizContainer.appendChild(quizItem);
});

// Verificar as respostas do Quiz
document.getElementById('submit-quiz').addEventListener('click', () => {
    let score = 0;
    
    quizData.forEach((item, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (selected && parseInt(selected.value) === item.correct) {
            score++;
        }
    });

    const resultDiv = document.getElementById('quiz-result');
    resultDiv.innerHTML = `Você acertou ${score} de 5 perguntas! ${score >= 3 ? '🌱 Muito bem! Você entende de agro sustentável.' : '🚜 Continue estudando para aprender mais!'}`;
});
