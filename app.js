var inquirer = require('inquirer');
var basicCardSet = [];
var clozeCardSet = [];

var makeBasiccard = function() {
    inquirer.prompt([{
        type: "input",
        message: "Type in the question for the 'front' of the flashcard!",
        name: "front"
    }, {
        type: "input",
        message: "Type the answer to that question for the 'back' of the flashcard!",
        name: "back"
    }]).then(function(flashcard) {
        function BasicCard(front, back) {
            this.front = flashcard.front;
            this.back = flashcard.back;
        }
        BasicCard.prototype.revealAnswer = function() {
            console.log(`The answer is ${this.back}`);
        }
        var basicCard = new BasicCard(flashcard.front, flashcard.back);
        basicCardSet.push(basicCard);
        console.log(basicCardSet);

        inquirer.prompt([{
            type: "list",
            message: "Want to make another?",
            choices: ["Yes", "All Finished let's study!"],
            name: "continue"
        }]).then(function(data) {
            if (data.continue === "Yes") {
                makeBasiccard();
            } else {
                console.log(basicCardSet);
            }

        });
    });
}

var makeClozeCard = function() {
    inquirer.prompt([{
        type: "input",
        message: "Type in the full sentence that you want to memorize!",
        name: "text"
    }, {
        type: "input",
        message: "Type the portion of the sentence you want to remove!",
        name: "cloze"
    }]).then(function(flashcard) {
        var makeAnother = function() {
            inquirer.prompt([{
                type: "list",
                message: "Want to make another?",
                choices: ["Yes", "All Finished let's study!"],
                name: "continue"
            }]).then(function(data) {
                if (data.continue === "Yes") {
                    makeClozeCard();
                } else {
                    console.log(clozeCardSet);
                }
            });
        };
        if (!flashcard.text.includes(flashcard.cloze)) {
            console.log("HMMMM I don't see the answer in your sentence Let's try again!");
            makeAnother();
        } else {
            function ClozeCard(text, cloze) {
                this.text = flashcard.text, //full sentence
                    this.cloze = flashcard.back //deleted text       
            };
            var clozeCard = new ClozeCard(flashcard.text, flashcard.cloze);
            clozeCardSet.push(clozeCard);
            makeAnother();
        };
        // have a property or method that contains or returns only the cloze-deleted portion of the text.
        // ClozeCard.prototype.showDeletedText = function() {
        //         console.log(flashcard.cloze);
        //     }
        //     // ClozeCard should have a property or method that contains or returns only the partial text.
        // ClozeCard.prototype.replaceText = function() {
        //     var ellipsis = "...";
        //     var partialText = flashcard.text.replace(flashcard.cloze, ellipsis);
        //     // ClozeCard should throw or log an error when the cloze deletion does not appear in the input text.

        //     return (partialText);
        // };
        // // ClozeCard should have a property or method that contains or returns only the full text.
        // ClozeCard.prototype.revealFullText = function() {
        //     console.log(flashcard.text);
        // }
    });
}

inquirer.prompt([{
    type: "list",
    message: "How would you like to  study today?",
    choices: ["Basic flash cards", "Cloze flash cards"],
    name: "cards"
}]).then(function(answer) {
    if (answer.cards === 'Basic flash cards') {
        makeBasiccard();
    } else {
        makeClozeCard();
    }
});
