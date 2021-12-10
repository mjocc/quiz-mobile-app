import { createSlice } from '@reduxjs/toolkit';
import reducers from './reducers';

export interface Quiz {
  id: string;
  text: string;
  modified: number; // unix time
  questions: string[]; // array of 'foreign keys'
}
export interface Question {
  id: string;
  order: number;
  text: string;
  options: string[]; // array of 'foreign keys'
}
export interface Option {
  id: string;
  order: number;
  text: string;
  correct: boolean;
}
export type Item = Quiz | Question | Option;

export interface QuizSliceState {
  quizzes: Quiz[];
  questions: Question[];
  options: Option[];
}

const initialState: QuizSliceState = {
  quizzes: [],
  questions: [],
  options: [],
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers,
});

export const {
  addQuiz,
  renameQuiz,
  removeQuiz,
  addQuestion,
  renameQuestion,
  removeQuestion,
  addOption,
  renameOption,
  removeOption,
  setCorrectOption,
} = quizSlice.actions;
export default quizSlice.reducer;
