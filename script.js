document.addEventListener("DOMContentLoaded", () => {
    const correctGroups = {
        "Fraude": ["Prevenção", "Investigação"],
        "Ética": ["Conduta", "Integridade"],
        "Segurança": ["Dados", "Proteção"],
        "Relatório": ["Transparência", "Auditoria"]
    };

    let selectedWords = [];
    let attempts = 0;
    let correctCount = 0;
    let errorCount = 0;
    const gameBoard = document.getElementById("game-board");
    const messageDiv = document.getElementById("message");
    const attemptsSpan = document.getElementById("attempts");
    const correctSpan = document.getElementById("correct");
    const errorsSpan = document.getElementById("errors");

    function createButtons() {
        const words = [];
        Object.entries(correctGroups).forEach(([key, values]) => {
            words.push(key, ...values);
        });

        words.sort(() => Math.random() - 0.5);

        words.forEach(word => createButton(word));
    }

    function createButton(word) {
        const button = document.createElement("button");
        button.textContent = word;
        button.addEventListener("click", () => onButtonClick(word, button));
        gameBoard.appendChild(button);
    }

    function onButtonClick(word, button) {
        if (button.classList.contains("correct")) return;

        if (selectedWords.length < 3) {
            button.classList.add("selected");
            selectedWords.push({ word, button });
        }

        if (selectedWords.length === 3) {
            checkGroup();
        }
    }

    function checkGroup() {
        attempts++;
        attemptsSpan.textContent = attempts;

        const [first, second, third] = selectedWords;

        for (const [key, values] of Object.entries(correctGroups)) {
            if (
                (first.word === key && values.includes(second.word) && values.includes(third.word)) ||
                (second.word === key && values.includes(first.word) && values.includes(third.word)) ||
                (third.word === key && values.includes(first.word) && values.includes(second.word))
            ) {
                correctCount++;
                correctSpan.textContent = correctCount;
                markCorrect([first, second, third]);
                showMessage("Correto!", "success");
                selectedWords = [];
                return;
            }
        }

        errorCount++;
        errorsSpan.textContent = errorCount;
        markIncorrect([first, second, third]);
        showMessage("Incorreto. Tente novamente.", "error");
        setTimeout(() => {
            selectedWords.forEach(({ button }) => button.classList.remove("incorrect", "selected"));
            selectedWords = [];
        }, 1000);
    }

    function markCorrect(buttons) {
        buttons.forEach(({ button }) => {
            button.classList.add("correct");
            button.classList.remove("selected");
            button.disabled = true;
        });
    }

    function markIncorrect(buttons) {
        buttons.forEach(({ button }) => {
            button.classList.add("incorrect");
        });
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    }

    createButtons();
});
