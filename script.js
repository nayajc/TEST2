
// 질문 데이터
const QUESTIONS = [
  {
    question: "전 배우자는 대화를 할 때 어떤 모습이었나요? 🗣️",
    options: [
      { text: "일방적으로 말만 했어요", score: { explosive: 2, avoidant: 1 } },
      { text: "듣는 척만 하고 무시했어요", score: { avoidant: 3, cold: 1 } },
      { text: "대화 자체를 회피했어요", score: { avoidant: 3, cold: 2 } },
      { text: "차분히 논의하려고 했어요", score: { cooperative: 3 } }
    ]
  },
  {
    question: "갈등이 생겼을 때 어떻게 반응했나요? 💥",
    options: [
      { text: "큰소리부터 지르며 화를 냈어요", score: { explosive: 3 } },
      { text: "연락을 끊고 잠수를 탔어요", score: { avoidant: 2, impulsive: 1 } },
      { text: "피하거나 주제를 바꿨어요", score: { avoidant: 3 } },
      { text: "중재자나 해결책을 찾으려 했어요", score: { cooperative: 3 } }
    ]
  },
  {
    question: "내 감정이나 상황에 대한 이해는 어땠나요? 🧠",
    options: [
      { text: "전혀 공감하지 않았어요", score: { cold: 3, explosive: 1 } },
      { text: "형식적으로만 위로했어요", score: { cold: 2 } },
      { text: "자기 얘기만 계속했어요", score: { explosive: 2, impulsive: 1 } },
      { text: "진심으로 이해하려 노력했어요", score: { cooperative: 3 } }
    ]
  }
];

const RESULTS = {
  avoidant: { name: "회피형 스펀지 🧽", description: "문제를 회피하고 감정을 숨기는 경향이 있어요." },
  explosive: { name: "감정폭발형 로켓 🚀", description: "감정 기복이 크고 충동적으로 반응하는 편이에요." },
  cold: { name: "냉철한 계산형 🧊", description: "감정 표현이 적고 거리감이 느껴지는 유형이에요." },
  impulsive: { name: "충동형 드리블러 🌪️", description: "즉흥적으로 판단하며 일관성이 부족해요." },
  cooperative: { name: "협력형 평화주의자 🌈", description: "소통과 협력에 적극적인 이상적인 유형이에요." }
};

let currentQuestion = 0;
let answers = [];
let scores = { avoidant: 0, explosive: 0, cold: 0, impulsive: 0, cooperative: 0 };

function startTest() {
  currentQuestion = 0;
  answers = [];
  scores = { avoidant: 0, explosive: 0, cold: 0, impulsive: 0, cooperative: 0 };
  document.getElementById('result').innerHTML = '';
  showQuestion();
}

function showQuestion() {
  const quiz = document.getElementById('quiz');
  quiz.innerHTML = '';

  if (currentQuestion >= QUESTIONS.length) {
    showResult();
    return;
  }

  const q = QUESTIONS[currentQuestion];
  const questionEl = document.createElement('div');
  questionEl.className = 'question';
  questionEl.innerHTML = `<h3>Q${currentQuestion + 1}. ${q.question}</h3>`;

  const optionsEl = document.createElement('div');
  optionsEl.className = 'options';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt.text;
    btn.onclick = () => {
      Object.keys(opt.score).forEach(type => {
        scores[type] += opt.score[type];
      });
      answers.push(opt.text);
      currentQuestion++;
      showQuestion();
    };
    optionsEl.appendChild(btn);
  });

  questionEl.appendChild(optionsEl);
  quiz.appendChild(questionEl);
}

function showResult() {
  const resultDiv = document.getElementById('result');
  const max = Math.max(...Object.values(scores));
  const type = Object.keys(scores).find(k => scores[k] === max);
  const result = RESULTS[type];

  resultDiv.innerHTML = `
    <h2>당신의 전 배우자 유형은: ${result.name}</h2>
    <p>${result.description}</p>
    <h4>상세 점수</h4>
    <ul>
      ${Object.keys(scores).map(k => `<li>${k}: ${scores[k]}</li>`).join('')}
    </ul>
  `;
}
