import {
  createSelector, createSlice, nanoid, PayloadAction
} from '@reduxjs/toolkit';
import _find from 'lodash-es/find';
import _remove from 'lodash-es/remove';
import { RootState } from '../store';

interface QuizSliceState {
  quizzes: Quiz[];
  questions: Question[];
  options: Option[];
}

const initialState: QuizSliceState = {
  quizzes: [],
  questions: [],
  options: [],
};

const updateModifiedQuiz = (
  state: QuizSliceState,
  { id, quiz }: { id?: string; quiz?: Quiz }
) => {
  const updateModifiedQuiz = (quiz: Quiz) => {
    quiz.modified = new Date().getTime();
  };
  if (quiz) {
    updateModifiedQuiz(quiz);
  } else if (id) {
    const quiz = _find(state.quizzes, { id });
    if (quiz) {
      updateModifiedQuiz(quiz);
    }
  }
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    addQuiz(state, { payload: quiz }: PayloadAction<Quiz>) {
      state.quizzes.push(quiz);
    },
    renameQuiz(
      state,
      { payload: { id, text } }: PayloadAction<{ id: string; text: string }>
    ) {
      const quiz = _find(state.quizzes, { id });
      if (quiz) {
        quiz.text = text;
        updateModifiedQuiz(state, { quiz });
      }
    },
    removeQuiz(state, { payload: id }: PayloadAction<string>) {
      _remove(state.quizzes, { id });
    },
    addQuestion(
      state,
      {
        payload: { question, quizId },
      }: PayloadAction<{ question: Question; quizId: string }>
    ) {
      state.questions.push(question);
      const quiz = _find(state.quizzes, { id: quizId });
      if (quiz) {
        quiz.questions.push(question.id);
        updateModifiedQuiz(state, { quiz });
      }
    },
    renameQuestion(
      state,
      {
        payload: { questionId, quizId, text },
      }: PayloadAction<{ questionId: string; quizId: string; text: string }>
    ) {
      const question = _find(state.questions, { id: questionId });
      if (question) {
        question.text = text;
        updateModifiedQuiz(state, { id: quizId });
      }
    },
    removeQuestion(
      state,
      {
        payload: { questionId, quizId },
      }: PayloadAction<{ questionId: string; quizId: string }>
    ) {
      const quiz = _find(state.quizzes, { id: quizId });
      if (quiz) {
        _remove(quiz.questions, (question: string) => {
          return question === questionId;
        });
        updateModifiedQuiz(state, { quiz });
      }
      _remove(state.questions, { id: questionId });
    },
    // addOption(state, { payload: option }: PayloadAction<Option>) {
    //   state.options.push(option);
    // },
    // renameOption(
    //   state,
    //   { payload: { id, text } }: PayloadAction<{ id: string; text: string }>
    // ) {
    //   const option = _find(state.options, { id });
    //   if (option) {
    //     option.text = text;
    //     updateModifiedQuiz(state, { option });
    //   }
    // },
    // removeOption(state, { payload: id }: PayloadAction<string>) {
    //   _remove(state.options, { id });
    // },
  },
});

export const {
  addQuiz,
  renameQuiz,
  removeQuiz,
  addQuestion,
  renameQuestion,
  removeQuestion,
  // addOption,
  // renameOption,
  // removeOption,
} = quizSlice.actions;

const selectQuizzes = (state: RootState) => state.quiz.quizzes;
const makeSelectQuestions = () =>
  createSelector(
    (state: RootState) => state.quiz.questions,
    (state: RootState, quizId: string) => {
      const quiz = _find(state.quiz.quizzes, { id: quizId });
      if (quiz) {
        return quiz.questions;
      } else {
        return null;
      }
    },
    (questions, questionIDs) => {
      if (questions && questionIDs) {
        try {
          return questionIDs.map((questionId: string) => {
            const question = _find(questions, { id: questionId });
            if (question) {
              return question;
            } else {
              throw `quiz not found`;
            }
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
  const quiz = _find(state.quiz.quizzes, { id: quizId });
  if (quiz) {
    return quiz.text;
  }
};
export { selectQuizzes, makeSelectQuestions, selectQuizName };
export { createQuizFromText, createQuestionFromText };

const createQuizFromText = (text: string): Quiz => ({
  id: nanoid(),
  text,
  modified: new Date().getTime(),
  questions: [],
});
const createQuestionFromText = (
  text: string,
  questions: Question[]
): Question => ({
  id: nanoid(),
  order: questions.length + 1,
  text,
  options: [],
});

export default quizSlice.reducer;
