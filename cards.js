'use strict';

function BasicCard(front, back) {
    this.front = front;
    this.back = back;
}

BasicCard.prototype.revealAnswer = function() {
    console.log(`The answer is ${this.back}`);
}; 

function ClozeCard(text, cloze) {
    this.text = text; //full sentence
    this.cloze = cloze; //deleted text       
};

// have a property or method that contains or returns only the cloze-deleted portion of the text.
ClozeCard.prototype.showDeletedText = function() {
    return this.cloze;
}
// ClozeCard should have a property or method that contains or returns only the partial text.
ClozeCard.prototype.replaceText = function() {
    const ellipsis = "...";
    const partialText = this.text.replace(this.cloze, ellipsis);
    return partialText;
};
// ClozeCard should have a property or method that contains or returns only the full text.
ClozeCard.prototype.revealFullText = function() {
    return this.text;
}

module.exports = {
	BasicCard: BasicCard,
	ClozeCard: ClozeCard
}; 