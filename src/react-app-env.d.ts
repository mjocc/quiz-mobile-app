/// <reference types="react-scripts" />

interface Item {
  text: string;
  id: string;
  [key: string]: any;
}

interface Option {
  id: string;
  order: number;
  text: string;
  correct: boolean;
};

interface Question {
  id: string;
  order: number;
  text: string;
  options: string[]; // array of 'foreign keys'
};

interface Quiz {
  id: string;
  order: number;
  text: string;
  modified: number; // unix time
  questions: string[]; // array of 'foreign keys'
};
