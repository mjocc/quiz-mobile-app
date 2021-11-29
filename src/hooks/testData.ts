const getTestData = () => ({ quizzes });

export { getTestData };

const quizzes: Quiz[] = [
  {
    id: '1',
    order: 1,
    text: 'First quiz',
    modified: new Date('2020-01-01'),
    questions: [
      {
        id: '1',
        order: 1,
        text: 'What is 5 + 9?',
        options: [
          {
            id: '1',
            order: 1,
            text: '14',
            correct: true,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    order: 2,
    text: 'Second quiz',
    modified: new Date('2020-01-02'),
    questions: [
      {
        id: '1',
        order: 1,
        text: 'What is 5 + 9?',
        options: [
          {
            id: '1',
            order: 1,
            text: '14',
            correct: true,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    order: 3,
    text: 'Third quiz',
    modified: new Date('2020-01-03'),
    questions: [
      {
        id: '1',
        order: 1,
        text: 'What is 5 + 9?',
        options: [
          {
            id: '1',
            order: 1,
            text: '14',
            correct: true,
          },
        ],
      },
    ],
  },
];
