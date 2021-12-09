import {
  createSelector
} from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getStateItem } from './helpers';

const selectQuizzes = (state: RootState) => state.quiz.quizzes;
const makeSelectQuestions = () =>
  createSelector(
    (state: RootState) => state.quiz.questions,
    (state: RootState, quizId: string) => {
      let questions: string[] | undefined;
      getStateItem(state.quiz.quizzes, quizId, (quiz) => {
        questions = quiz.questions;
      });
      return questions;
    },
    (questions, questionIds) => {
      if (questions && questionIds) {
        try {
          return questionIds.map((questionId: string) => {
            let question: Question | undefined;
            getStateItem(questions, questionId, (innerQuestion) => {
              if (innerQuestion) {
                question = innerQuestion;
              } else {
                throw 'quiz not found';
              }
            });
            return question as Question;
          });
        } catch (error) {
          return null;
        }
      } else {
        return null;
      }
    }
  );
const selectQuizName = (quizId: string) => (state: RootState) => {
  let text: string | undefined;
  getStateItem(state.quiz.quizzes, quizId, (quiz) => {
    text = quiz.text;
  });
  return text;
};

export { selectQuizzes, makeSelectQuestions, selectQuizName };
