const inquirer = require('inquirer');
const Cards = require('./cards.js');

const basicCardSet = [];
const clozeCardSet = [];

const makeBasiccard = () => {
    inquirer.prompt([{
        type: "input",
        message: "Type in the question for the 'front' of the flashcard!",
        name: "front"
    }, {
        type: "input",
        message: "Type the answer to that question for the 'back' of the flashcard!",
        name: "back"
    }]).then(flashcard => {
        const basicCard = new Cards.BasicCard(flashcard.front, flashcard.back.toLowerCase());
        basicCardSet.push(basicCard);
        inquirer.prompt([{
            type: "list",
            message: "Want to make another?",
            choices: ["Yes", "All finished let's study!"],
            name: "continue"
        }]).then(function(data) {
            if (data.continue === "Yes") {
                makeBasiccard();
            } else {
                // console.log(basicCardSet);
                studyBasic(basicCardSet, basicCardSet.length);
            }

        });
    });
}

const studyBasic = (arr, x) => {
    if (x > 0) {
        const card = arr[x - 1];
        // console.log(card); 
        inquirer.prompt([{
            type: "input",
            message: card.front,
            name: "answer"
        }]).then(answer => {
        	answer.answer.toLowerCase();
            if (answer.answer === card.back) {
                console.log('CORRECT!');
            } else {
                console.log('not quite!');
                card.revealAnswer();
            }
            x -= 1;
            studyBasic(arr, x);
        });
    } else {
        console.log('All done!');
    }
};


const makeClozeCard = () => {
    inquirer.prompt([{
        type: "input",
        message: "Type in the full sentence that you want to memorize!",
        name: "text"
    }, {
        type: "input",
        message: "Type the portion of the sentence you want to remove!",
        name: "cloze"
    }]).then(flashcard => {
        const makeAnother = () => {
            inquirer.prompt([{
                type: "list",
                message: "Want to make another?",
                choices: ["Yes", "All finished let's study!"],
                name: "continue"
            }]).then(data => {
                if (data.continue === "Yes") {
                    makeClozeCard();
                } else {
                    studyClozeCards(clozeCardSet, clozeCardSet.length);
                }
            });
        };
        if (!flashcard.text.includes(flashcard.cloze)) {
            console.log("HMMMM I don't see the answer in your sentence Let's try again!");
            makeAnother();
        } else {
            // cloze 
            const clozeCard = new Cards.ClozeCard(flashcard.text, flashcard.cloze);
            clozeCardSet.push(clozeCard);
            makeAnother();
        };

    });
}

const studyClozeCards = (arr, x) => {
    if (x > 0) {
        const card = arr[x - 1];
        // console.log(card); 
        inquirer.prompt([{
            type: "input",
            message: card.replaceText(),
            name: "answer"
        }]).then(answer => {
        	answer.answer.toLowerCase();
            if (answer.answer === card.cloze) {
                console.log('CORRECT!');
            } else {
                console.log('Not quite!');
                card.revealFullText();
            }
            x -= 1;
            studyClozeCards(arr, x);
        });
    } else {
        console.log('All done!');
    }
}

inquirer.prompt([{
    type: "list",
    message: "How would you like to  study today?",
    choices: ["Basic flash cards", "Cloze flash cards"],
    name: "cards"
}]).then(answer => {
    if (answer.cards === 'Basic flash cards') {
        makeBasiccard();
    } else {
        makeClozeCard();
    }
});
