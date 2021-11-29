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
  options: Option[];
};

interface Quiz {
  id: string;
  order: number;
  text: string;
  modified: Date;
  questions: Question[];
};
