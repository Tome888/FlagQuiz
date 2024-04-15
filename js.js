const url_api = "https://restcountries.com/v3.1/all";
const h1Name = document.getElementById('nameOfCountry');
const wrapperOfFlags = document.getElementById('wrapperFlags');
const lifeLinesEl = document.getElementById('lifeLines');
const score = document.getElementById('score');

const btnPick = document.getElementById('pickBtn');
const btnNext = document.getElementById('nextBtn');
const btnSure = document.getElementById('sureBtn');
const btnAgain = document.getElementById('againBtn');

let scoreNum = 0;
let attempts = 3;
let flagName;
let onOfSwitchFunc = true;
let countries;

fetch(url_api)
    .then(response => response.json())
    .then((data) => {
        countries = data;
        console.log(countries[0].name.common);
        const randomNumbers = random3Numbers();
        addingFlags(countries, randomNumbers);
    })
    .catch(err => console.log(`Something Went Wrong: ${err}`));

const random3Numbers = () => {
    const numbers = [];
    for (let i = 0; i < 3; i++) {
        numbers.push(Math.floor(Math.random() * 251));
    }
    return numbers;
}

const addingFlags = (countries, randomNumbers) => {
    wrapperOfFlags.innerHTML = '';
    randomNumbers.forEach(index => {
        const country = countries[index];
        const flagUrl = country.flags?.png;
        if (flagUrl) {
            wrapperOfFlags.innerHTML += `<img data-name="${country.name.common}" src="${flagUrl}" alt="${country.name.common}">`;
        } else {
            console.log(`Flags not found for country: ${country.name.common}`);
        }
    });

    const randomNumbTo3 = Math.floor(Math.random()*3);
    const h1Numb = randomNumbers[randomNumbTo3];
    console.log(h1Numb);
    h1Name.innerHTML = `${countries[h1Numb].name.common}`;
}

const scoreGenerate = () =>{
    score.innerText = `Score: ${scoreNum}`;
}

const lifeLineGenerator = () =>{
    lifeLinesEl.innerHTML = '';
    for (let i = 0; i < attempts; i++) {
        lifeLinesEl.innerHTML += `<i class="fa-solid fa-heart" style="color: #e35454"></i>`
    }
}

const pickFlag = () => {
    wrapperOfFlags.addEventListener('click', (event) => {
        if (onOfSwitchFunc) {
            const flag = event.target
            const childNodes = wrapperOfFlags.childNodes
            if (flag === wrapperOfFlags) {
                return;
            }
            childNodes.forEach(img => {
                img.style.border = ''
            });
            flag.style.border = '10px solid rgb(255, 244, 85)';
            flagName = flag.getAttribute('data-name');
            btnPick.classList.add('none');
            btnNext.classList.add('none');
            btnSure.classList.add('block');
            btnPick.classList.remove('block');
           
        }
        else {
            return;
        }   
    });
}

const validateFunc = () =>{
    btnSure.classList.add('none');
    btnNext.classList.add('none');
    btnAgain.classList.add('none');

    btnSure.addEventListener('click', () => {
        console.log(flagName)
        console.log(h1Name.innerText)
        btnSure.classList.remove('block');
        btnPick.classList.add('none');
        btnNext.classList.add('block');
        onOfSwitchFunc = false;
        if (flagName === h1Name.innerText) {
            const element = document.querySelector(`[data-name="${flagName}"]`);
            element.style.border = "10px solid green";
            console.log(`${element} is correct`);
            scoreNum++;
            score.innerHTML = `Score: ${scoreNum}`;
        }
        else {
            const element = document.querySelector(`[data-name="${flagName}"]`);
            element.style.border = "10px solid red";
            lifeLinesEl.innerHTML = ``;
            attempts--;
            lifeLineGenerator();
            gameOver()
        }
    });
    btnNext.addEventListener('click', () => {
        btnSure.classList.add('none');
        btnPick.classList.add('block');
        btnNext.classList.add('none');
        btnSure.classList.remove('block');
        btnNext.classList.remove('block');
        
        onOfSwitchFunc=true

        const randomNumbers = random3Numbers();
        addingFlags(countries, randomNumbers);
    });
}

const gameOver = () =>{
    if(attempts <= 0){
        btnAgain.classList.remove('none');

        btnSure.classList.add('none');
        btnPick.classList.add('none');
        btnNext.classList.add('none');
        btnSure.classList.remove('block');
        btnNext.classList.remove('block');

        addToLocal()
        btnAgain.addEventListener('click', () =>{
            btnAgain.classList.add('none');
            btnPick.classList.remove('none');
            btnPick.classList.add('block');

            const randomNumbers = random3Numbers();
            addingFlags(countries, randomNumbers); 
            lifeLineGenerator();
            score.innerHTML = `Score: 0`
            lifeLinesEl.innerHTML = ''
            lifeLinesEl.innerHTML += `<i class="fa-solid fa-heart" style="color: #e35454"></i>
            <i class="fa-solid fa-heart" style="color: #e35454"></i>
            <i class="fa-solid fa-heart" style="color: #e35454"></i>`

            onOfSwitchFunc=true
            attempts = 3
            scoreNum = 0
        });
    }
};

const landingStart = () =>{
    const startBtn = document.getElementById('startBtn');
    const landingPage = document.querySelector('.landing');
    const btnInfo = document.querySelector('.info');
    const btnHistory = document.querySelector('.history');

    startBtn.addEventListener('click', () =>{
        landingPage.style.opacity = '0'
        setTimeout(() => {
            landingPage.style.display = 'none'
            btnInfo.style.position = 'relative'
            btnHistory.style.position = 'relative'
        }, 500);
    });
}

const infoBtn = () =>{
    const btnInfo = document.querySelector('.info');
    const theDiv = document.querySelector('.infoDiv');
    btnInfo.addEventListener('mouseover', () =>{
        theDiv.style.display = 'flex';
    });
    btnInfo.addEventListener('mouseout', () =>{
        theDiv.style.display = 'none';
    });
}

const addToLocal = ()=>{
    const timestamp = new Date().getTime();
    localStorage.setItem(timestamp, scoreNum);

}

const showHistory = () => {
    const btnHistory = document.querySelector('.history');
    const theHistoryDiv = document.querySelector('.historyDiv');
    const divHighScore = document.getElementById('stepGraph');

    btnHistory.addEventListener('click', ()=>{
        theHistoryDiv.classList.toggle('dflexxx');
        getFromLocalAndCreateHS()
        createGraph()
        setTimeout(() => {
            theHistoryDiv.classList.toggle('unhiddenHistory');
            btnHistory.classList.toggle('historyBtnBgColorOn');
                })
            
        }, 10);
    
};
const getFromLocalAndCreateHS = ()=>{
    const arrOfScores = []
    const divHighScore = document.getElementById('highScore');
    for (let i = 0; i < localStorage.length; i++) {
        const numKey = localStorage.key(i)
        const scoreFromLS = localStorage.getItem(numKey)
        arrOfScores.push(scoreFromLS)
        
    }
    const HighScore = Math.max(...arrOfScores)
    console.log(arrOfScores);
    console.log(HighScore)

    divHighScore.innerHTML = `<h4 class="highScoreH4">High Score: ${HighScore}</h4>`
};

const createGraph = () =>{

    const graphWrapper = document.getElementById('stepGraph');
    graphWrapper.innerHTML = ``
    if(localStorage.length < 10){
        for (let i= 0;  i < localStorage.length ; i++) {
            const numKey = localStorage.key(i)
            const scoreFromLS = localStorage.getItem(numKey)

            
            const createStep = document.createElement('div');
            graphWrapper.append(createStep)
            createStep.classList.add('oneStep');
            createStep.style.height = `${scoreFromLS}%`
            createStep.innerHTML=`${scoreFromLS}`
        }

    }else{
        for (let i= 0;  i < 10 ; i++) {
            const numKey = localStorage.key(i)
            const scoreFromLS = localStorage.getItem(numKey)

            
            const createStep = document.createElement('div');
            graphWrapper.append(createStep)
            createStep.classList.add('oneStep');
            createStep.style.height = `${scoreFromLS}%`
            createStep.innerHTML=`${scoreFromLS}`
        }
    }

}


pickFlag();
validateFunc();
scoreGenerate();
lifeLineGenerator();
landingStart()
infoBtn()
showHistory()
