import { nanoid } from '@reduxjs/toolkit';
import _find from 'lodash-es/find';
import { QuizSliceState } from './slice';

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

export {
  getStateItem,
  updateModifiedQuiz,
  createQuizFromText,
  createQuestionFromText,
  createOptionFromText,
};
