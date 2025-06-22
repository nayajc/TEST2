 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
index a844e70064dbefda84f56ae81bd2a96c155cea15..ee2d7c7b3a3f7cf12bf9bf6ff0a22602068a22d4 100644
--- a/script.js
+++ b/script.js
@@ -1,63 +1,279 @@
 
-// 질문 데이터
+// 질문 데이터 (JSON 형태)
 const QUESTIONS = [
   {
+    id: 1,
+    category: "대화방식",
     question: "전 배우자는 대화를 할 때 어떤 모습이었나요? 🗣️",
     options: [
-      { text: "일방적으로 말만 했어요", score: { explosive: 2, avoidant: 1 } },
-      { text: "듣는 척만 하고 무시했어요", score: { avoidant: 3, cold: 1 } },
-      { text: "대화 자체를 회피했어요", score: { avoidant: 3, cold: 2 } },
-      { text: "차분히 논의하려고 했어요", score: { cooperative: 3 } }
+      { text: "일방적으로 말만 했어요", value: "dominant", score: { explosive: 2, avoidant: 1 } },
+      { text: "듣는 척만 하고 무시했어요", value: "ignore", score: { avoidant: 3, cold: 1 } },
+      { text: "대화 자체를 회피했어요", value: "avoid", score: { avoidant: 3, cold: 2 } },
+      { text: "차분히 논의하려고 했어요", value: "discuss", score: { cooperative: 3 } }
     ]
   },
   {
+    id: 2,
+    category: "갈등반응",
     question: "갈등이 생겼을 때 어떻게 반응했나요? 💥",
     options: [
-      { text: "큰소리부터 지르며 화를 냈어요", score: { explosive: 3 } },
-      { text: "연락을 끊고 잠수를 탔어요", score: { avoidant: 2, impulsive: 1 } },
-      { text: "피하거나 주제를 바꿨어요", score: { avoidant: 3 } },
-      { text: "중재자나 해결책을 찾으려 했어요", score: { cooperative: 3 } }
+      { text: "큰소리부터 지르며 화를 냈어요", value: "shout", score: { explosive: 3 } },
+      { text: "연락을 끊고 잠수를 탔어요", value: "disappear", score: { avoidant: 2, impulsive: 1 } },
+      { text: "피하거나 주제를 바꿨어요", value: "escape", score: { avoidant: 3 } },
+      { text: "중재자나 해결책을 찾으려 했어요", value: "mediate", score: { cooperative: 3 } }
     ]
   },
   {
+    id: 3,
+    category: "공감능력",
     question: "내 감정이나 상황에 대한 이해는 어땠나요? 🧠",
     options: [
-      { text: "전혀 공감하지 않았어요", score: { cold: 3, explosive: 1 } },
-      { text: "형식적으로만 위로했어요", score: { cold: 2 } },
-      { text: "자기 얘기만 계속했어요", score: { explosive: 2, impulsive: 1 } },
-      { text: "진심으로 이해하려 노력했어요", score: { cooperative: 3 } }
+      { text: "전혀 공감하지 않았어요", value: "no_empathy", score: { cold: 3, explosive: 1 } },
+      { text: "형식적으로만 위로했어요", value: "formal", score: { cold: 2 } },
+      { text: "자기 얘기만 계속했어요", value: "selfish", score: { explosive: 2, impulsive: 1 } },
+      { text: "진심으로 이해하려 노력했어요", value: "understanding", score: { cooperative: 3 } }
+    ]
+  },
+  {
+    id: 4,
+    category: "책임감",
+    question: "경제적, 가정적 책임은 어떻게 나눴나요? 💼",
+    options: [
+      { text: "대부분 제가 혼자 떠안았어요", value: "me_only", score: { avoidant: 2, cold: 1 } },
+      { text: "서로 공평하게 나눴어요", value: "equal", score: { cooperative: 3 } },
+      { text: "책임을 회피하거나 미뤘어요", value: "avoid_responsibility", score: { avoidant: 2, impulsive: 2 } },
+      { text: "독단적으로 결정만 했어요", value: "unilateral", score: { explosive: 1, cold: 2 } }
+    ]
+  },
+  {
+    id: 5,
+    category: "육아태도",
+    question: "아이 양육에 대한 태도는 어땠나요? 🍼",
+    options: [
+      { text: "거의 무관심했어요", value: "indifferent", score: { avoidant: 3, cold: 2 } },
+      { text: "지나치게 간섭했어요", value: "interfere", score: { explosive: 2 } },
+      { text: "함께 노력했어요", value: "cooperative", score: { cooperative: 3 } },
+      { text: "방임하거나 독단적이었어요", value: "neglect", score: { impulsive: 2, cold: 1 } }
+    ]
+  },
+  {
+    id: 6,
+    category: "신뢰성",
+    question: "거짓말이나 숨기는 행동은 얼마나 있었나요? 🤥",
+    options: [
+      { text: "자주 있었고 들키면 발뺌했어요", value: "frequent_lies", score: { impulsive: 3, explosive: 1 } },
+      { text: "가끔 있었지만 들키면 인정했어요", value: "occasional", score: { impulsive: 1 } },
+      { text: "거의 없었어요", value: "rarely", score: { cooperative: 2 } },
+      { text: "전혀 몰라서 모르겠어요", value: "unknown", score: { cold: 1, avoidant: 1 } }
+    ]
+  },
+  {
+    id: 7,
+    category: "사과능력",
+    question: "문제가 생겼을 때 사과는 어떻게 했나요? 💬",
+    options: [
+      { text: "절대 사과하지 않았어요", value: "never", score: { explosive: 2, cold: 2 } },
+      { text: "형식적으로만 사과했어요", value: "formal_apology", score: { cold: 2 } },
+      { text: "진심으로 사과했어요", value: "sincere", score: { cooperative: 3 } },
+      { text: "오히려 저에게 화를 냈어요", value: "blame_me", score: { explosive: 3 } }
+    ]
+  },
+  {
+    id: 8,
+    category: "독립성",
+    question: "개인적인 삶과 감정 관리는 어땠나요? 🧍‍♂️",
+    options: [
+      { text: "지나치게 의존적이었어요", value: "dependent", score: { explosive: 1, impulsive: 2 } },
+      { text: "적당히 독립적이었어요", value: "independent", score: { cooperative: 2 } },
+      { text: "너무 독립적이어서 소통이 어려웠어요", value: "too_independent", score: { cold: 3, avoidant: 1 } },
+      { text: "감정 기복이 심했어요", value: "unstable", score: { explosive: 2, impulsive: 2 } }
     ]
   }
 ];
 
-const RESULTS = {
-  avoidant: { name: "회피형 스펀지 🧽", description: "문제를 회피하고 감정을 숨기는 경향이 있어요." },
-  explosive: { name: "감정폭발형 로켓 🚀", description: "감정 기복이 크고 충동적으로 반응하는 편이에요." },
-  cold: { name: "냉철한 계산형 🧊", description: "감정 표현이 적고 거리감이 느껴지는 유형이에요." },
-  impulsive: { name: "충동형 드리블러 🌪️", description: "즉흥적으로 판단하며 일관성이 부족해요." },
-  cooperative: { name: "협력형 평화주의자 🌈", description: "소통과 협력에 적극적인 이상적인 유형이에요." }
+const RESULT_TYPES = {
+  avoidant: {
+    name: "회피형 스펀지 🧽",
+    emoji: "🧽",
+    description: "감정이나 책임을 피하고 현실 도피를 하는 유형입니다. 대화보다는 침묵을 선택하고, 문제 해결을 미루는 경향이 있어요.",
+    tips: [
+      "📧 이메일이나 문자로 먼저 소통을 시도하세요 - 직접 대화보다 부담을 덜 느낍니다",
+      "⏰ 응답 기한을 명확히 설정하되, 충분한 시간을 주세요 (최소 3-5일)",
+      "📋 복잡한 내용은 단계별로 나누어 전달하고, 한 번에 하나씩만 해결하세요",
+      "🎯 감정적 표현보다는 구체적 사실과 필요사항을 중심으로 대화하세요",
+      "🤝 중간에서 도와줄 수 있는 공통 지인이나 가족을 활용해보세요",
+      "📝 모든 합의사항은 반드시 서면으로 기록하고 확인받으세요"
+    ],
+    color: "#A8E6CF",
+    warnings: [
+      "⚠️ 압박이나 재촉은 오히려 더 회피하게 만들 수 있어요",
+      "⚠️ 감정적 호소나 과거 이야기는 피하는 것이 좋습니다"
+    ],
+    longTermStrategy: "꾸준하고 일관된 접근이 필요해요. 시간이 걸리더라도 인내심을 갖고 단계적으로 접근하세요."
+  },
+  explosive: {
+    name: "감정폭발형 로켓 🚀",
+    emoji: "🚀",
+    description: "감정적 반응이 크고 즉흥적인 유형입니다. 화가 나면 폭발하고, 감정 조절이 어려운 특징을 보여요.",
+    tips: [
+      "🧘‍♀️ 상대방이 흥분했을 때는 절대 맞서지 말고 잠시 시간을 두세요",
+      "👥 중요한 대화는 반드시 제3자(변호사, 상담사, 가족)가 있는 자리에서 하세요",
+      "📱 통화보다는 문자나 이메일로 소통하여 충동적 반응을 줄이세요",
+      "📊 감정보다는 객관적 사실과 데이터를 중심으로 대화하세요",
+      "🎬 대화 내용을 녹음하거나 증인을 세워 나중에 '그런 말 안 했다'는 상황을 방지하세요",
+      "⏰ 대화 시간을 미리 정해두고 길어지지 않도록 관리하세요",
+      "🛡️ 감정적 폭발 시 즉시 대화를 중단하고 안전한 곳으로 피하세요"
+    ],
+    color: "#FFB3BA",
+    warnings: [
+      "⚠️ 상대방의 감정 상태를 자극하는 말이나 행동은 절대 피하세요",
+      "⚠️ 혼자서 만나는 것은 위험할 수 있으니 공개된 장소나 제3자가 있는 곳에서 만나세요"
+    ],
+    longTermStrategy: "안전이 최우선입니다. 전문가의 도움을 받아 체계적으로 접근하고, 필요시 법적 보호장치를 마련하세요."
+  },
+  cold: {
+    name: "냉철한 계산형 🧊",
+    emoji: "🧊",
+    description: "감정 표현이 적고 매우 이성적인 유형입니다. 논리적이지만 때로는 차갑게 느껴질 수 있어요.",
+    tips: [
+      "📊 구체적인 숫자, 날짜, 조건을 명확하게 제시하여 대화하세요",
+      "💼 비즈니스 미팅처럼 체계적이고 전문적인 접근을 하세요",
+      "📋 사전에 의제를 정리하고 논리적 순서로 대화를 진행하세요",
+      "🔍 상대방의 이익과 실용적 측면을 강조하여 설득하세요",
+      "📄 모든 내용을 문서화하고 계약서 형태로 정리하세요",
+      "⚖️ 법적 근거나 판례를 제시하면 더 효과적입니다",
+      "🎯 감정적 어필보다는 합리적 근거와 win-win 방안을 제시하세요"
+    ],
+    color: "#B3D9FF",
+    warnings: [
+      "⚠️ 감정적 호소나 과거 추억을 언급하는 것은 효과가 없어요",
+      "⚠️ 즉흥적인 요청보다는 충분한 준비와 근거를 갖추고 접근하세요"
+    ],
+    longTermStrategy: "철저한 준비와 논리적 접근이 핵심입니다. 전문가의 도움을 받아 법적, 재정적 근거를 탄탄히 하세요."
+  },
+  impulsive: {
+    name: "충동형 드리블러 🌪️",
+    emoji: "🌪️",
+    description: "계획성이 부족하고 말이 자주 바뀌는 유형입니다. 즉흥적이고 일관성이 떨어지는 특징을 보여요.",
+    tips: [
+      "✍️ 모든 약속과 합의를 즉시 서면으로 기록하고 서명받으세요",
+      "📱 중요한 대화는 문자나 이메일로 재확인하여 증거를 남기세요",
+      "🗓️ 약속 전날과 당일에 다시 한 번 확인 연락을 하세요",
+      "💰 금전 관련 약속은 반드시 공증이나 법적 절차를 거치세요",
+      "⏰ 단기간 내에 실행 가능한 작은 단위로 나누어 요청하세요",
+      "👥 중요한 약속에는 증인을 세우거나 제3자를 동석시키세요",
+      "🔔 정기적으로 진행상황을 체크하고 리마인드하세요",
+      "📋 체크리스트를 만들어 단계별로 확인하며 진행하세요"
+    ],
+    color: "#FFFFB3",
+    warnings: [
+      "⚠️ 구두약속만으로는 절대 신뢰하지 마세요",
+      "⚠️ 큰 결정을 한 번에 요구하지 말고 단계별로 접근하세요"
+    ],
+    longTermStrategy: "철저한 기록 관리와 단계별 접근이 필요합니다. 신뢰보다는 시스템과 절차에 의존하세요."
+  },
+  cooperative: {
+    name: "협력형 평화주의자 🌈",
+    emoji: "🌈",
+    description: "조율이 가능하고 협상 태도가 있는 유형입니다. 문제 해결을 위해 함께 노력하려는 의지를 보여요.",
+    tips: [
+      "🤝 상호 존중하는 분위기에서 열린 대화를 시도하세요",
+      "🎯 공통 목표(특히 아이들의 행복)를 먼저 확인하고 시작하세요",
+      "💬 '우리'라는 표현을 사용하여 협력적 분위기를 조성하세요",
+      "⚖️ 각자의 입장과 필요를 솔직하게 나누고 윈-윈 방안을 모색하세요",
+      "📅 정기적인 대화 시간을 정하여 소통을 유지하세요",
+      "🔄 상황 변화에 따라 유연하게 조정할 수 있는 여지를 남겨두세요",
+      "📝 합의사항을 문서화하되, 너무 경직되지 않게 작성하세요",
+      "🎉 작은 성공도 서로 인정하고 격려하며 관계를 발전시키세요"
+    ],
+    color: "#DDA0DD",
+    warnings: [
+      "⚠️ 너무 신뢰하여 필요한 보호장치를 소홀히 하지 마세요",
+      "⚠️ 상대방의 협력적 태도가 변할 수 있음을 항상 염두에 두세요"
+    ],
+    longTermStrategy: "가장 이상적인 상황입니다. 지속적인 소통과 상호 존중을 바탕으로 건강한 관계를 유지하세요."
+  }
+};
+
+const SITUATION_GUIDES = {
+  childCustody: {
+    title: "👶 자녀 양육 관련",
+    avoidant: [
+      "양육 스케줄을 달력 앱으로 공유하여 자동으로 알림이 가도록 설정",
+      "아이와 관련된 중요한 결정은 이메일로 의견을 물어보고 1주일 정도 시간을 줌",
+      "학교 행사나 병원 방문 등은 미리 공지하되 참여 여부는 강요하지 않음"
+    ],
+    explosive: [
+      "아이 앞에서는 절대 갈등 상황을 만들지 않기",
+      "양육비나 면접교섭 문제는 법원이나 상담센터를 통해 해결",
+      "아이 인계 시에는 공개된 장소에서 짧고 간단하게 처리"
+    ],
+    cold: [
+      "양육비, 교육비 등 구체적인 비용 산출표 작성하여 제시",
+      "아이의 성장 발달 상황을 객관적 데이터로 공유",
+      "양육 관련 규칙과 원칙을 명확히 정하고 서면 합의"
+    ],
+    impulsive: [
+      "면접교섭 약속은 반드시 전날 재확인",
+      "아이와의 약속이나 계획은 구체적으로 정하고 서면으로 전달",
+      "급작스러운 계획 변경 시 대안을 미리 준비해두기"
+    ],
+    cooperative: [
+      "아이의 행복을 위한 공동 양육 계획 수립",
+      "정기적인 양육 상황 점검 미팅 진행",
+      "아이의 성장에 따른 양육 방식 조정을 위한 지속적 소통"
+    ]
+  },
+  financialMatters: {
+    title: "💰 재산 분할 및 금전 문제",
+    avoidant: [
+      "재산 목록과 분할 방안을 서면으로 작성하여 이메일로 전달",
+      "복잡한 재산은 전문가(감정평가사, 세무사)의 도움을 받아 객관적 평가",
+      "답변 기한을 넉넉히 주되, 명확한 데드라인 설정"
+    ],
+    explosive: [
+      "재산 분할은 반드시 변호사나 법원을 통해 진행",
+      "감정적 대화는 피하고 오직 법적 절차에 따라 처리",
+      "직접 만나서 금전 문제를 논의하지 않기"
+    ],
+    cold: [
+      "모든 재산을 투명하게 공개하고 합리적 분할 기준 제시",
+      "세금, 수수료 등 부대비용까지 포함한 정확한 계산서 작성",
+      "법적 근거와 판례를 바탕으로 한 분할 방안 제시"
+    ],
+    impulsive: [
+      "모든 금전 거래는 공증이나 법적 절차를 거쳐 처리",
+      "구두 약속은 절대 믿지 말고 서면 계약서 작성",
+      "분할 재산 이전 시에는 단계별로 나누어 진행"
+    ],
+    cooperative: [
+      "서로의 경제적 상황을 고려한 합리적 분할 방안 모색",
+      "아이들의 미래를 위한 교육비, 의료비 등 공동 대응 방안 마련",
+      "정기적으로 경제적 상황 변화에 대해 소통하고 조정"
+    ]
+  }
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
@@ -67,36 +283,36 @@ function showQuestion() {
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
-  const result = RESULTS[type];
+  const result = RESULT_TYPES[type];
 
   resultDiv.innerHTML = `
     <h2>당신의 전 배우자 유형은: ${result.name}</h2>
     <p>${result.description}</p>
     <h4>상세 점수</h4>
     <ul>
       ${Object.keys(scores).map(k => `<li>${k}: ${scores[k]}</li>`).join('')}
     </ul>
   `;
 }
 
EOF
)
