let score = parseInt(localStorage.getItem('score')) || 0;
let pointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
let upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 10;
let autoClickerEnabled = JSON.parse(localStorage.getItem('autoClickerEnabled')) || false;
let autoClickInterval = parseInt(localStorage.getItem('autoClickInterval')) || 1000;
let autoClicksPerInterval = parseInt(localStorage.getItem('autoClicksPerInterval')) || 1;
let appliedUpgrades = JSON.parse(localStorage.getItem('appliedUpgrades')) || {};

const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const upgradeButton = document.querySelector('#upgradeButton');
const pointsPerClickDisplay = document.querySelector('#pointsPerClick');
const autoClickerButton = document.querySelector('#autoClickerButton');
const upgradeAutoClickerButton = document.querySelector('#upgradeAutoClickerButton');

const upgradeLevels = [
    { score: 1000, pointsPerClickIncrease: 1, autoClickIntervalDecrease: 100  },
    { score: 5000, pointsPerClickIncrease: 2, autoClickIntervalDecrease: 100 },
    { score: 10000, pointsPerClickIncrease: 3, autoClickIntervalDecrease: 100  },
    { score: 30000, pointsPerClickIncrease: 4, autoClickIntervalDecrease: 100},
    { score: 50000, pointsPerClickIncrease: 5, autoClickIntervalDecrease: 100 },
    { score: 100000, pointsPerClickIncrease: 6, autoClickIntervalDecrease: 100 },
    { score: 500000, pointsPerClickIncrease: 7, autoClickIntervalDecrease: 100},
    { score: 1000000, pointsPerClickIncrease: 10, autoClickIntervalDecrease: 100 },
    { score: 5000000, pointsPerClickIncrease: 15, autoClickIntervalDecrease: 50 },
];

const requiredScoreForAutoClicker = 1000;
const requiredScoreForAutoClickerUpgrade = 1000;

autoClickerButton.style.display = 'none';
upgradeAutoClickerButton.style.display = 'none';

function start() {
    updateScore();
    updateUpgradeButton();
    setImage();
    checkForUpgrade(true); 
    checkScore(); 
    if (autoClickerEnabled) {
        startAutoClicker(true);
    }
}

function setScore(newScore) {
    score = newScore;
    localStorage.setItem('score', score);
    $score.textContent = score;
    checkScore(); 
}

function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

function addOne() {
    setScore(getScore() + pointsPerClick);
    checkForUpgrade(); 
    setImage();
}

function updateScore() {
    $score.textContent = score;
    localStorage.setItem('score', score);
    checkScore();
}

function checkScore() {
    if (score >= requiredScoreForAutoClicker) {
        autoClickerButton.style.display = 'block';
    }
    if (score >= requiredScoreForAutoClickerUpgrade) {
        upgradeAutoClickerButton.style.display = 'block';
    } else {
        upgradeAutoClickerButton.style.display = 'none';
    }
}

function setImage() {
    if (score >= 500000) {
        $circle.setAttribute('src', './assets/bird10.jpg');
    } else if (score >= 1000000) {
        $circle.setAttribute('src', './assets/bird9.jpg');
    } else if (score >= 500000) {
        $circle.setAttribute('src', './assets/bird8.jpg');
    } else if (score >= 100000) {
        $circle.setAttribute('src', './assets/bird7.jpg');
    } else if (score >= 50000) {
        $circle.setAttribute('src', './assets/bird6.jpg');
    } else if (score >= 20000) {
        $circle.setAttribute('src', './assets/bird5.jpg');
    } else if (score >= 10000) {
        $circle.setAttribute('src', './assets/bird4.jpg');
    } else if (score >= 5000) {
        $circle.setAttribute('src', './assets/bird3.jpg');
    } else if (score >= 1000) {
        $circle.setAttribute('src', './assets/bird2.png');
    }
}

function checkForUpgrade(initialLoad = false) {
    for (let i = 0; i < upgradeLevels.length; i++) {
        let level = upgradeLevels[i];
        if (score >= level.score && !appliedUpgrades[level.score]) {
            pointsPerClick += level.pointsPerClickIncrease;
            autoClickInterval = Math.max(autoClickInterval - level.autoClickIntervalDecrease, 100); 
            autoClicksPerInterval++;
            appliedUpgrades[level.score] = true;
            localStorage.setItem('appliedUpgrades', JSON.stringify(appliedUpgrades)); 
            updateUpgradeButton(); 
            
            if (!initialLoad) {
                alert(`Кликер улучшен! Теперь вы зарабатываете ${pointsPerClick} очков за клик и ${autoClicksPerInterval} за автоклик!`);
            }
        }
    }
}

$circle.addEventListener('click', (event) => {
    const rect = $circle.getBoundingClientRect();

    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    const DEG = 40;

    const tiltX = (offsetY / rect.height) * DEG;
    const tiltY = (offsetX / rect.width) * -DEG;

    $circle.style.setProperty('--tiltX', `${tiltX}deg`);
    $circle.style.setProperty('--tiltY', `${tiltY}deg`);

    setTimeout(() => {
        $circle.style.setProperty('--tiltX', `0deg`);
        $circle.style.setProperty('--tiltY', `0deg`);
    }, 300);

    const plusOne = document.createElement('div');
    plusOne.classList.add('plus-one');
    plusOne.textContent = `+${pointsPerClick}`;
    plusOne.style.position = 'absolute';
    plusOne.style.left = `${event.clientX - rect.left}px`;
    plusOne.style.top = `${event.clientY - rect.top}px`;

    $circle.parentElement.appendChild(plusOne);

    addOne();

    setTimeout(() => {
        plusOne.remove();
    }, 2000);
});

upgradeButton.addEventListener('click', () => {
    if (score >= upgradeCost) {
        score -= upgradeCost;
        pointsPerClick += 1;
        upgradeCost = Math.floor(upgradeCost * 1.5);
        updateScore();
        updateUpgradeButton();
    }
});

function updateUpgradeButton() {
    document.getElementById('upgradeCost').textContent = `(Cost: ${upgradeCost})`;
    pointsPerClickDisplay.textContent = pointsPerClick;
    localStorage.setItem('pointsPerClick', pointsPerClick);
    localStorage.setItem('upgradeCost', upgradeCost);
}

autoClickerButton.addEventListener('click', () => startAutoClicker());

upgradeAutoClickerButton.addEventListener('click', () => {
    if (score >= 2000000) {
        score -= 2000000;
        autoClicksPerInterval = 2;
        autoClickInterval -= 20;
        updateScore();
        if (autoClickerEnabled) {
            clearInterval(autoClickerInterval);
            startAutoClicker();
        }
    } else {
        alert('Недостаточно монет для улучшения автокликера!');
    }
});

function startAutoClicker(initialLoad = false) {
    if (!autoClickerEnabled) {
        autoClickerEnabled = true;
        localStorage.setItem('autoClickerEnabled', true);
        autoClickerInterval = setInterval(() => {
            score += autoClicksPerInterval;
            updateScore();
            checkForUpgrade();
        }, autoClickInterval);
        autoClickerButton.textContent = 'Deactivate Auto-Clicker';
    } else {
        autoClickerEnabled = false;
        localStorage.setItem('autoClickerEnabled', false);
        clearInterval(autoClickerInterval);
        autoClickerButton.textContent = 'Activate Auto-Clicker';
    }

    if (!initialLoad) {
        localStorage.setItem('autoClickInterval', autoClickInterval);
        localStorage.setItem('autoClicksPerInterval', autoClicksPerInterval);
    }
}

start();
