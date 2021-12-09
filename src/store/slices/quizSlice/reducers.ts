import {
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers
} from '@reduxjs/toolkit';
import _remove from 'lodash-es/remove';
import { getStateItem, updateModifiedQuiz } from './helpers';
import { QuizSliceState } from './slice';

const reducers: ValidateSliceCaseReducers<
  QuizSliceState,
  SliceCaseReducers<QuizSliceState>
> = {
  addQuiz(state, { payload: quiz }: PayloadAction<Quiz>) {
    state.quizzes.push(quiz);
  },
  renameQuiz(
    state,
    { payload: { quiz, text } }: PayloadAction<{ quiz: Quiz; text: string }>
  ) {
    getStateItem(state.quizzes, quiz, (stateQuiz) => {
      stateQuiz.text = text;
      updateModifiedQuiz({ quiz: stateQuiz });
    });
  },
  removeQuiz(state, { payload: quiz }: PayloadAction<Quiz>) {
    _remove(state.quizzes, { id: quiz.id });
  },
  addQuestion(
    state,
    {
      payload: { question, quizId },
    }: PayloadAction<{ question: Question; quizId: string }>
  ) {
    getStateItem(state.quizzes, quizId, (quiz) => {
      state.questions.push(question);
      quiz.questions.push(question.id);
      updateModifiedQuiz({ quiz });
    });
  },
  renameQuestion(
    state,
    {
      payload: { question, quizId, text },
    }: PayloadAction<{ question: Question; quizId: string; text: string }>
  ) {
    getStateItem(state.questions, question, (stateQuestion) => {
      stateQuestion.text = text;
      updateModifiedQuiz({ state, id: quizId });
    });
  },
  removeQuestion(
    state,
    {
      payload: { question, quizId },
    }: PayloadAction<{ question: Question; quizId: string }>
  ) {
    getStateItem(state.quizzes, quizId, (quiz) => {
      _remove(
        quiz.questions,
        (innerQuestion: string) => innerQuestion === question.id
      );
      _remove(state.questions, { id: question.id });
      updateModifiedQuiz({ quiz });
    });
  },
  addOption(
    state,
    {
      payload: { option, questionId, quizId },
    }: PayloadAction<{ option: Option; questionId: string; quizId: string }>
  ) {
    getStateItem(state.questions, questionId, (question) => {
      question.options.push(option.id);
      state.options.push(option);
      updateModifiedQuiz({ state, id: quizId });
    });
  },
  renameOption(
    state,
    {
      payload: { option, quizId, text },
    }: PayloadAction<{
      option: Option;
      questionId: string;
      quizId: string;
      text: string;
    }>
  ) {
    getStateItem(state.options, option, (option) => {
      option.text = text;
      updateModifiedQuiz({ state, id: quizId });
    });
  },
  removeOption(
    state,
    {
      payload: { option, questionId, quizId },
    }: PayloadAction<{ option: Option; questionId: string; quizId: string }>
  ) {
    getStateItem(state.questions, questionId, (question) => {
      _remove(
        question.options,
        (innerOption: string) => innerOption === option.id
      );
      _remove(state.options, { id: option.id });
      updateModifiedQuiz({ state, id: quizId });
    });
  },
};

export default reducers;