const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');

function start() {
    setScore(getScore());
    setImage()
}

function setScore(score) {
    localStorage.setItem('score', score);
    $score.textContent = score;
}

function getScore() {
    return Number(localStorage.getItem('score')) || 0; 
    

    
        
        
    }

    

   
function addOne() {
    setScore(getScore() + 1);
    setImage()
   
}
function setImage(){
    if(getScore() >= 500) {
      $circle.setAttribute('src','./assets/bird2.png')
    }
    if(getScore() >= 1000) {
        $circle.setAttribute('src','./assets/bird3.jpg')
      }


   


    if(getScore() >= 5000) {
      $circle.setAttribute('src','./assets/bird4.jpg')
    }

    if(getScore() >= 10000) {
      $circle.setAttribute('src','./assets/bird5.jpg')
    }


    if(getScore() >= 20000) {
      $circle.setAttribute('src','./assets/bird6.jpg')
    }


    if(getScore() >= 50000) {
      $circle.setAttribute('src','./assets/bird7.jpg')
    }


    if(getScore() >= 100000) {
      $circle.setAttribute('src','./assets/bird8.jpg')
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
    plusOne.textContent = '+1';
    plusOne.style.position = 'absolute';
    plusOne.style.left = `${event.clientX - rect.left}px`;
    plusOne.style.top = `${event.clientY - rect.top}px`;

    $circle.parentElement.appendChild(plusOne);

    addOne();
    

    setTimeout(() => { 
        plusOne.remove();
    }, 2000);
});

// Получаем элементы из DOM
const scoreDisplay = document.getElementById('score');
const circle = document.getElementById('circle');
const upgradeButton = document.getElementById('upgradeButton');
const pointsPerClickDisplay = document.getElementById('pointsPerClick');

// Загрузка сохраненных данных или установка значений по умолчанию
let score = parseInt(localStorage.getItem('score')) || 0;
let pointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
let upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 10;

// Обновление количества очков на экране
function updateScore() {
    scoreDisplay.textContent = score;
    localStorage.setItem('score', score);
}

// Обработка кликов по птице
circle.addEventListener('click', () => {
    score += pointsPerClick;
    updateScore();
    animateScore();
});

// Логика прокачки
upgradeButton.addEventListener('click', () => {
    if (score >= upgradeCost) {
        score -= upgradeCost;
        pointsPerClick += 1;
        upgradeCost = Math.floor(upgradeCost * 1.5);
        updateScore();
        updateUpgradeButton();
        updateClickValue();
    }
});

// Обновление кнопки прокачки
function updateUpgradeButton() {
    document.getElementById('upgradeCost').textContent = `(Cost: ${upgradeCost})`;
    pointsPerClickDisplay.textContent = pointsPerClick;
    localStorage.setItem('pointsPerClick', pointsPerClick);
    localStorage.setItem('upgradeCost', upgradeCost);
}

// Функция для обновления отображения очков за клик
function updateClickValue() {
    clickValueDisplay.textContent = `Points per click: ${pointsPerClick}`;
}

// Начальная инициализация
updateScore();
updateUpgradeButton();
updateClickValue();








start();
