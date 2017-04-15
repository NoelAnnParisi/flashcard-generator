const inquirer = require('inquirer');
const Cards = require('./cards.js');
//save flashcards to arrays to study from them 
const basicCardSet = [];
const clozeCardSet = [];

//instansiate the inquirer prompt
const inq = (args) => {
    return inquirer.prompt(args);
}

//initializing various prompts 
const startPrompt = [{
    type: "list",
    message: "How would you like to study today?",
    choices: ["Basic Flashcards", "Cloze Flashcards"],
    name: "cards"
}];

const basicCardPrompt = [{
    type: "input",
    message: "What should the 'front' of the flashcard say? (the question)",
    name: "front"
}, {
    type: "input",
    message: "What should the 'back' of the flashcard say? (the answer)",
    name: "back"
}];

const clozeCardPrompt = [{
    type: "input",
    message: "Write out the full sentence you wish to memorize.",
    name: "text"
}, {
    type: "input",
    message: "Now, write out the portion of the sentence you wish to remove for studying purposes.",
    name: "cloze"
}];

const makeAnotherPrompt = [{
    type: "list",
    message: "Do you want to make another?",
    choices: ["Yes, please!", "I'm finished, let's study!"],
    name: "continue"
}];

const keepStudyingPrompt = [{
    type: "list",
    message: "Would you like to try again?",
    choices: ["Yes, please!", "No, I'm ready!"],
    name: "keepStudying"
}];

//begin interaction function
const beginInteraction = () => {
    inq(startPrompt).then(answer => {
        if (answer.cards === 'Basic Flashcards') {
            //begin making basic flashcards
            makeBasiccard();
        } else {
            //begin making cloze flashcards
            makeClozeCard();
        }
    });
};

//prompt users to make basic flashcards
const makeBasiccard = () => {
    inq(basicCardPrompt).then(flashcard => {
        //instansiate new BasicCard object
        const basicCard = new Cards.BasicCard(flashcard.front, flashcard.back.toLowerCase());
        //add card to the basic card array
        basicCardSet.push(basicCard);
        //ask if user wants to make another flashcard or start studying
        inquirer.prompt([{
            type: "list",
            message: "Want to make another?",
            choices: ["Yes, please!", "I'm finished, let's study!"],
            name: "continue"
        }]).then(data => {
            if (data.continue === "Yes, please!") {
                //some recursive action
                makeBasiccard();
            } else {
                //pass the array of BasicCards, & length, to studyBasic
                studyBasic(basicCardSet, basicCardSet.length);
            }

        });
    });
};

//study from basic flashcards
const studyBasic = (arr, x) => {
    if (x > 0) {
        const card = arr[x - 1];
        inquirer.prompt([{
            type: "input",
            message: card.front,
            name: "answer"
        }]).then(answer => {
            if (answer.answer.toLowerCase() === card.back.toLowerCase()) {
                console.log('CORRECT!');
            } else {
                console.log('Not quite!');
                card.revealAnswer();
            }
            x -= 1;
            studyBasic(arr, x);
        });
        //ask user if they'd like to go through the cards again
    } else {
        inq(keepStudyingPrompt).then(answer => {
            if (answer.keepStudying === "Yes, please!") {
                studyBasic(basicCardSet, basicCardSet.length);
            } else {
                console.log('See you later and good luck!');
            }
        });
    }
};

//prompt users to make close cards
const makeClozeCard = () => {
    inq(clozeCardPrompt).then(flashcard => {
        const makeAnother = () => {
            inq(makeAnotherPrompt).then(data => {
                if (data.continue === "Yes, please!") {
                    makeClozeCard();
                } else {
                    studyClozeCards(clozeCardSet, clozeCardSet.length);
                }
            });
        };
        //if the user types in a word/words that aren't in the full tex, notify them and repeat makeClozeCard
        if (!flashcard.text.toLowerCase().includes(flashcard.cloze.toLowerCase())) {
            console.log("Hmmm, I don't see that text in the sentence you wish to memorize, let's try again!");
            makeAnother();
        } else {
            const clozeCard = new Cards.ClozeCard(flashcard.text.toLowerCase(), flashcard.cloze.toLowerCase());
            clozeCardSet.push(clozeCard);
            makeAnother();
        };

    });
}

//study cloze cards
const studyClozeCards = (arr, x) => {
    if (x > 0) {
        const card = arr[x - 1];
        inquirer.prompt([{
            type: "input",
            message: card.replaceText(),
            name: "answer"
        }]).then(answer => {
            if (answer.answer.toLowerCase() === card.cloze) {
                console.log(card.showDeletedText(), 'was correct!');
            } else {
                console.log('Not quite!', card.revealFullText(), "is the correct answer");

            }
            x -= 1;
            studyClozeCards(arr, x);
        });
    } else {
        inq(keepStudyingPrompt).then(answer => {
            if (answer.keepStudying === "Yes, please!") {
                studyClozeCards(clozeCardSet, clozeCardSet.length);
            } else {
                console.log('See you later and good luck!');
            }
        });
    }
};

beginInteraction();