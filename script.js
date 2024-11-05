let empirismoScore = 0;
let racionalismoScore = 0;

const quizContainer = document.getElementById("quiz");
const startButton = document.getElementById("start-btn");
const quizImage = document.getElementById("quiz-image");

let quizData;
let currentQuestionIndex = 0;

function loadQuizData(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'quiz-data.json', true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                quizData = JSON.parse(xhr.responseText);
                console.log(quizData); // Verifique os dados carregados
                if (!Array.isArray(quizData) || quizData.length === 0) {
                    console.error("Os dados do quiz não estão no formato correto ou estão vazios.");
                    return;
                }
                callback();
            } catch (error) {
                console.error("Erro ao analisar JSON:", error);
            }
        } else {
            console.error("Erro ao carregar os dados do quiz:", xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error("Erro de rede");
    };
    xhr.send();
}

function startQuiz() {
    startButton.classList.add("hidden");
    quizImage.classList.add("hidden");
    loadQuizData(loadQuiz); // Carrega os dados e depois carrega a primeira pergunta
}

function loadQuiz() {
    const currentQuestion = quizData[currentQuestionIndex];
    if (!currentQuestion) {
        console.error("Pergunta não encontrada para o índice:", currentQuestionIndex);
        return; // Para evitar o erro
    }
    quizContainer.innerHTML = `
        <div class="question">${currentQuestion.question}</div>
        <div class="answers">
            <label><input type="radio" name="answer" value="empirismo"> ${currentQuestion.a}</label><br>
            <label><input type="radio" name="answer" value="racionalismo"> ${currentQuestion.b}</label>
        </div>
        <button class="submit-btn" onclick="nextQuestion()">Próxima Pergunta</button>
    `;
    quizContainer.classList.remove("hidden");
}



function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
        alert("Por favor, selecione uma resposta!");
        return;
    }
    const answer = selected.value;
    if (answer === "empirismo") {
        empirismoScore++;
    } else {
        racionalismoScore++;
    }
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuiz();
    } else {
        showResults();
    }
}

// Resto do código permanece igual

function showResults() {
    let resultMessage;
    let imageSrc;

    if (empirismoScore > racionalismoScore) {
        resultMessage = "Seu pensamento é mais Empirista!";
        imageSrc = "bacon.png"; // Imagem de um filósofo empirista
    } else if (racionalismoScore > empirismoScore) {
        resultMessage = "Seu pensamento é mais Racionalista!";
        imageSrc = "descartes.jpg"; // Imagem de um filósofo racionalista
    } else {
        resultMessage = "Você tem uma mistura equilibrada de Empirismo e Racionalismo!";
        imageSrc = ""; // Nenhuma imagem específica para o resultado equilibrado
    }

    // Mostra o resultado
    quizContainer.innerHTML = `
        <div class="result-container">
            <div class="result">${resultMessage}</div>
            ${imageSrc ? `<img src="${imageSrc}" alt="Filósofo" style="max-width: 200px; margin-top: 10px;">` : ""}
            <button class="submit-btn" onclick="restartQuiz()">Fazer o Quiz Novamente</button>
        </div>
    `;

    // Esconde a imagem inicial ao mostrar o resultado
    quizImage.classList.add("hidden");
}

function restartQuiz() {
    empirismoScore = 0;
    racionalismoScore = 0;
    currentQuestionIndex = 0;
    quizImage.classList.remove("hidden"); // Mostra a imagem inicial novamente
    loadQuiz(); // Carrega a primeira pergunta novamente
}
