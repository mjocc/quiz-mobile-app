/// <reference types="react-scripts" />

type Item = Quiz | Question | Option;

interface Quiz {
  id: string;
  text: string;
  modified: number; // unix time
  questions: string[]; // array of 'foreign keys'
}

interface Question {
  id: string;
  order: number;
  text: string;
  options: string[]; // array of 'foreign keys'
}

interface Option {
  id: string;
  order: number;
  text: string;
  correct: boolean;
}
