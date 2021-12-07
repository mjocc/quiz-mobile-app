import {
  createSelector,
  createSlice,
  nanoid,
  PayloadAction,
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
  param: { state: QuizSliceState; id: string } | { quiz: Quiz }
) => {
  const updateModifiedQuiz = (quiz: Quiz) => {
    quiz.modified = new Date().getTime();
  };
  if ('quiz' in param) {
    updateModifiedQuiz(param.quiz);
  } else {
    const quiz = _find(param.state.quizzes, { id: param.id });
    if (quiz) {
      updateModifiedQuiz(quiz);
    }
  }
};
const getStateItem = <T extends Item>(
  stateSection: T[],
  itemOrId: T | string,
  cb: (stateItem: T) => void
) => {
  let item: T | undefined;
  if (typeof itemOrId === 'string') {
    item = _find(stateSection, { id: itemOrId }) as T | undefined;
  } else {
    item = itemOrId;
  }
  if (item) {
    const stateItem = _find(
      stateSection,
      (stateItem) => stateItem.id === item!.id
    );
    if (stateItem) {
      cb(stateItem);
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
  },
});

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
const createOptionFromText = (
  text: string,
  options: Option[],
  correct: boolean = false
): Option => ({
  id: nanoid(),
  order: options.length + 1,
  text,
  correct,
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
export { selectQuizzes, makeSelectQuestions, selectQuizName };
export { createQuizFromText, createQuestionFromText, createOptionFromText };
export default quizSlice.reducer;
