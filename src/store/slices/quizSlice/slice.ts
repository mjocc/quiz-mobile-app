import { createSlice } from '@reduxjs/toolkit';
import reducers from './reducers';

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
} = quizSlice.actions;
export default quizSlice.reducer;
