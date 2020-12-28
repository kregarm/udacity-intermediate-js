// Create Dino Constructor
function Dino (dino) {
    this.species = dino.species;
    this.weight = dino.weight;
    this.height = dino.height;
    this.diet = dino.diet;
    this.locationn = dino.when;
    this.fact = [dino.fact];
    this.image = `images/${this.species.toLowerCase()}.png`;
}

Dino.prototype.compareWeight = function (human){
    if (this.weight > human.weight) {
        const weightDifference = this.weight - human.weight;
        this.fact.push(`${this.species} was ${weightDifference} lbs heavier than you are`);
    } else if (this.weight < human.weight) {
        const weightDifference = human.weight - this.weight;
        this.fact.push(`You are ${weightDifference} lbs heavier than ${this.species} was`);
    } else {
        this.fact.push(`You and ${this.species} have the same weihgt!`);
    }
};

Dino.prototype.compareHeight = function (human){
    if (this.height > human.height) {
        const heightDifference = this.height - human.height;
        this.fact.push(`${this.species} was ${heightDifference} inches taller than you are`);
    } else if (this.height < human.height) {
        const heightDifference = human.height - this.height;
        this.fact.push(`You are ${heightDifference} inches taller than ${this.species} was`);
    } else {
        this.fact.push(`You and ${this.species} have the same heihgt!`);
    }
};

Dino.prototype.compareDiet = function (human){
    if (this.diet === human.diet.toLowerCase()) {
        this.fact.push(`You and ${this.species} have the same diet!`);
    } else {
        this.fact.push(`You are a ${human.diet.toLowerCase()} but ${this.species} was a ${this.diet}`);
    }
};

// Create Human Object
function createHuman() {
    // Convert feet and inches to just inches
    const feet = document.getElementById('feet').value;
    const inches = document.getElementById('inches').value;
    const height = Number(feet) * 12 + Number(inches);

    const human = {
        name: document.getElementById('name').value,
        feet: document.getElementById('feet').value,
        height: height,
        weight: document.getElementById('weight').value,
        diet: document.getElementById('diet').value,
        image: 'images/human.png'
    };
    return human;
}

// Use IIFE to get human data from form
(function () {
    const submitButton = document.getElementById('btn');
    submitButton.onclick = function() {
        // Fetch dinos json from server
        fetch('/dinos')
        .then(function(response) {
            return response.json();
        }).then(function (data) {
            const human = createHuman();
            let infographicElemenets = [];

            // Create a dino object for every entry in the json
            for (let i in data.Dinos) {
                const dino = new Dino (data.Dinos[i]);
                // Don't compare with Pigeon as it always displays a static fact
                if (dino.species != 'Pigeon') {
                    dino.compareDiet(human);
                    dino.compareHeight(human);
                    dino.compareWeight(human);
                }
                infographicElemenets.push(dino);
            }

            // Insert human to 4th place to properly trigger the rendering
            infographicElemenets.splice(4, 0, human);

            // Remove form element
            clearUiElements('form');

            // Draw tiles
            createInfographic(infographicElemenets);
        }).catch(function(err) {
            alert(err);
        });
    };
})();

// Remove form from screen
function clearUiElements(uiElement) {
    const formElement = document.getElementById('dino-compare');
    switch(uiElement) {
    case 'form':
        formElement.style.display = 'none';
        break
    default:
        alert(`Clearing this ${uiElement} hasn't been implemented yet!`);
    }
}

// On button click, prepare and display infographic
function createInfographic(infographicElemenets) {

    function getRandomNumber(factArray) {
        return Math.floor(Math.random() * factArray.length)
    }

    const fragment = document.createDocumentFragment();
    const grid = document.getElementById('grid')

    for (let i = 0; i < infographicElemenets.length; i++) {
        const div = document.createElement('div');
        div.setAttribute('class','grid-item');

        // Skip fact property for human object as it doesn't have one
        if (i != 4) {
            const fact = document.createElement('p');
            const randomFactNumber = getRandomNumber(infographicElemenets[i].fact);
            fact.innerText = infographicElemenets[i].fact[randomFactNumber];
            div.appendChild(fact);
        }

        const name = document.createElement('h3');
        // Human doesn't have a species property, but has a name
        name.innerText = infographicElemenets[i].species || infographicElemenets[i].name;

        const image = document.createElement('img');
        image.setAttribute('src', infographicElemenets[i].image);

        div.appendChild(name);
        div.appendChild(image);
        fragment.appendChild(div);
    }
    
    grid.appendChild(fragment);
}