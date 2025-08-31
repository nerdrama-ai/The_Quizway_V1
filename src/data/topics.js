// example topic data and questions
export const TOPICS = [
{
id: 'math',
title: 'Math Basics',
description: 'Arithmetic and logic',
questions: [
{
id: 'm1',
q: 'What is 7 + 6?',
options: ['12','13','14','11'],
correctIndex: 1,
hint: 'Think about 7 + 3 = 10 then +3',
explanation: '7 + 6 = 13 because 7 + 3 = 10 then +3 = 13.'
},
{
id: 'm2',
q: 'Which is a prime?',
options: ['4','6','9','11'],
correctIndex: 3,
hint: 'Only divisible by 1 and itself',
explanation: '11 is prime because it has no divisors other than 1 and 11.'
}
]
},
{
id: 'science',
title: 'Science',
description: 'Basic science',
questions: [
{
id: 's1',
q: 'Water boils at what °C at sea level?',
options: ['90','95','100','110'],
correctIndex: 2,
hint: 'It is a round number',
explanation: 'Water boils at 100°C at standard atmospheric pressure.'
}
]
}
]
