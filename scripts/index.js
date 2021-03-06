let questionNumbers;
const sentencesForQuestion = [
  [
    'You too can transform your body.',
    'あなたも体を一変させることができるんです。',
  ],
  [
    'You might wanna wear long pants.',
    '長ズボンをはいたほうが、いいかもしれません。',
  ],
  [
    'We need to show our passports.',
    'パスポートを見せなければいけません。',
  ],
  [
    'Apart from that, what else do you know about her?',
    'それ以外に、何か彼女のことを知っているかい？',
  ],
  [
    'As a result of our hard work, we finished the project ahead of schedule.',
    'みんなの頑張りのおかげで、このプロジェクトを予定より早く完了することができました。',
  ],
];

const init = () => {
  shuffle(sentencesForQuestion);
  questionNumbers = 0;
  setQuestion();
  document.getElementById('num').innerText = `${questionNumbers + 1}/${
    sentencesForQuestion.length
  }`;
};

const setQuestion = () => {
  const question = `問${questionNumbers + 1}) ${
    sentencesForQuestion[questionNumbers][1]
  }`;
  document.getElementById('question').innerHTML = question;
  let words = sentencesForQuestion[questionNumbers][0]
    .slice(0, sentencesForQuestion[questionNumbers][0].length - 1)
    .split(' ');
  shuffle(words);
  document.getElementById('select').innerHTML = '';
  document.getElementById('answer').innerHTML = '';

  for (let i = 0; i < words.length; i++) {
    const word = document.createElement('span');
    word.innerText = words[i];
    word.draggable = true;
    word.ondragstart = dragWord;
    document.getElementById('select').appendChild(word);
    const answer = document.createElement('span');
    answer.innerText = `(${i + 1})`;
    answer.ondragover = dragOverWord;
    answer.ondragleave = dragLeaveWord;
    answer.ondrop = dropWord;
    answer.classList.add('reset');
    document.getElementById('answer').appendChild(answer);
  }

  const last = document.createElement('span');
  last.innerText = sentencesForQuestion[questionNumbers][0].slice(-1);
  document.getElementById('answer').appendChild(last);
  document.getElementById('next').disabled = true;
};

const dragWord = (event) => {
  event.dataTransfer.setData('text', event.target.innerText);
  event.target.classList.add('select');
};

const dropWord = (event) => {
  event.preventDefault();
  event.target.innerText = event.dataTransfer.getData('text');
  event.target.classList.remove('reset', 'select');
  event.target.classList.add('set');
};

const dragOverWord = (event) => {
  event.preventDefault();
  event.target.classList.add('select');
};

const dragLeaveWord = (event) => {
  setStyle(document.querySelector('#answer').children, 'remove', 'select');
};

const setStyle = (targetList, op, style1, style2 = null) => {
  // targetList.forEach((target) => {
  //   if (op === 'add') target.classList.add(style1, style2);
  //   if (op === 'remove') target.classList.remove(style1, style2);
  // });
  Array.prototype.forEach.call(targetList, (target) => {
    if (op === 'add') target.classList.add(style1, style2);
    if (op === 'remove') target.classList.remove(style1, style2);
  });
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const checkAnswer = () => {
  const words = document.querySelector('#answer').children;
  let answer = '';
  // words.forEach((word) => {
  //   answer += word.innerText + ' ';
  // });
  Array.prototype.forEach.call(words, (word) => {
    answer += word.innerText + ' ';
  });
  const question = sentencesForQuestion[questionNumbers][0].slice(0, -1);
  answer = answer.slice(0, -3);
  let check = 'ng';
  if (question === answer) {
    check = 'ok';
    speechSentence();
    if (questionNumbers < sentencesForQuestion.length - 1) {
      document.getElementById('next').disabled = false;
    }
  } else alert('不正解です！');
  setStyle(words, 'remove', 'ok', 'ng');
  setStyle(words, 'add', check);
};

const resetAnswer = () => {
  setStyle(document.querySelector('#select').children, 'remove', 'select');
  const answers = document.querySelector('#answer').children;
  setStyle(answers, 'remove', 'ok', 'ng');
  for (let i = 0; i < answers.length - 1; i++) {
    answers[i].classList.remove('set');
    answers[i].classList.add('reset');
    answers[i].innerHTML = '(' + (i + 1) + ')';
  }
};

const speechSentence = () => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = sentencesForQuestion[questionNumbers][0];
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
};

const nextQuestion = () => {
  questionNumbers++;
  setQuestion();
  document.getElementById('num').innerText = `${questionNumbers + 1}/${
    sentencesForQuestion.length
  }`;
};