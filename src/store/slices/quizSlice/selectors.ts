import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Option, Question } from './slice';
import { getStateItem } from './helpers';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';

const selectQuizzes = (state: RootState) => state.quiz.quizzes;

const makeSelectQuestions = () =>
  createSelector(
    (state: RootState) => state.quiz.questions,
    (state: RootState, quizId: string) => {
      let questionIds: string[] | undefined;
      getStateItem(state.quiz.quizzes, quizId, (quiz) => {
        questionIds = quiz.questions;
      });
      return questionIds;
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

const makeSelectOptions = () =>
  createSelector(
    (state: RootState) => state.quiz.options,
    (state: RootState, questionId: string) => {
      let optionIds: string[] | undefined;
      getStateItem(state.quiz.questions, questionId, (question) => {
        optionIds = question.options;
      });
      return optionIds;
    },
    (options, optionIds) => {
      if (options && optionIds) {
        try {
          return optionIds.map((optionId: string) => {
            let option: Option | undefined;
            getStateItem(options, optionId, (innerOption) => {
              if (innerOption) {
                option = innerOption;
              } else {
                throw 'question not found';
              }
            });
            return option as Option;
          });
        } catch (error) {
          return null;
        }
      } else {
        return null;
      }
    }
  );
const selectQuestionName = (questionId: string) => (state: RootState) => {
  let text: string | undefined;
  getStateItem(state.quiz.questions, questionId, (question) => {
    text = question.text;
  });
  return text;
};
const selectCorrectQuestion = (questionId: string) => (state: RootState) => {
  let options: Option[];
  getStateItem(state.quiz.questions, questionId, (question) => {
    options = _filter(state.quiz.options, (option) =>
      question.options.includes(option.id)
    );
  });
  let correctOption = _find(options!, 'correct');
  if (correctOption) {
    return correctOption.id;
  } else {
    return null;
  }
};

export {
  selectQuizzes,
  makeSelectQuestions,
  selectQuizName,
  makeSelectOptions,
  selectQuestionName,
  selectCorrectQuestion,
};
