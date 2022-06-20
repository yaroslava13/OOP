class Unit {
    constructor(name, health, damage, armor, attackSpeed) {
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.armor = armor;
        this.attackSpeed = attackSpeed;
    }

    attack(opp) {
        // proper formula for armor
        let armor = opp.health / (1 - opp.armor / 10);
        opp.health -= this.damage + armor;
    }
}


const heroList = [
    new Unit('Footman', 420, 12.5, 2, 1.2),
    new Unit('Knight', 885, 34, 5, 2),
    new Unit('Rifleman', 535, 21, 0, 1.5),
    new Unit('Dragonhawk Rider', 625, 19, 1, 1.8),
    new Unit('Gryphon Rider', 875, 50, 0, 2.5)
]
let myUnit;
let aiUnit;
let onGameStatChangeFunc;
let onEndGameFunc;
class Game {
    

    constructor(onStatChange, onEndGame) {
        onGameStatChangeFunc = onStatChange;
        onEndGameFunc = onEndGame;
    }

    setGameUnits(playerUnit) {
        myUnit = playerUnit;
        aiUnit = heroList[Math.floor(Math.random() * heroList.length)];
        onGameStatChangeFunc(myUnit, aiUnit);
    }

    playGame() {
        //wait for one unit to die
        while (myUnit.health > 0 && aiUnit.health > 0) {
            myUnit.attack(aiUnit);
            aiUnit.attack(myUnit);
            onGameStatChangeFunc(myUnit, aiUnit);
        }
        let winner = myUnit.isAlive ? myUnit : aiUnit;
        onEndGameFunc(winner);
    }
}
let fightButton = document.getElementsByClassName('fight')[0];
let game;
let heroButtons = [];
class Display {
     
    endgame(winner) {
        alert(`${winner.name} won`);
        location.reload();
        // restart of the page
    }

    showStats(myUnit, aiUnit) {
        // display units stats on screen
        let battle = document.getElementsByClassName('battle-field')[0];
        let myCard = document.createElement('div');
        let aiCard = document.createElement('div');
        myCard.setAttribute('class', 'card');
        aiCard.setAttribute('class', 'card');
        myCard.innerHTML = myUnit.name + ' HP: ' + myUnit.health;
        aiCard.innerHTML = aiUnit.name + ' HP: ' + aiUnit.health;
        battle.append(myCard);
        battle.append(aiCard);
    }
    
    createHeroButtons() {
        heroList.forEach(unit => {
            let unitBt = document.createElement('button');
            unitBt.innerHTML = unit.name;
            unitBt.classList.add('hidden');
            let field = document.getElementsByClassName('characters-list')[0];
            field.append(unitBt);
            unitBt.addEventListener('click', () => {
                game.setGameUnits(unit);
                this.hideHeroButtons();
                fightButton.classList.remove('hidden');
            });
            heroButtons.push(unitBt);
        });
    }

    chooseFigther() {
        heroButtons.forEach(bt => {
            bt.classList.remove('hidden');
        })
    }

    hideHeroButtons() {
        heroButtons.forEach(bt => {
            bt.classList.add('hidden');
        })
    }

    startGame() {
        let startButton = document.getElementsByClassName('start')[0];

        startButton.addEventListener('click', () => {
            startButton.classList.add('hidden');
            game = new Game(this.showStats, this.endgame);
            alert('Choose your fighter');
            this.createHeroButtons();
            this.chooseFigther();
        })

        fightButton.addEventListener('click', () => {
            game.playGame();
        })
    }
}
// when load - run startGame()
window.addEventListener('load', () => {
    let display = new Display();
    display.startGame();
});