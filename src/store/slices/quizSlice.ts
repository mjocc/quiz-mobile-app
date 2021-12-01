import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import _find from 'lodash-es/find';
import _remove from 'lodash-es/remove';
import _filter from 'lodash-es/filter';
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
  {
    quiz,
    question,
    option,
  }: {
    quiz?: Quiz;
    question?: Question;
    option?: Option;
  }
) => {
  const updateModified = (quiz: Quiz) => {
    quiz.modified = new Date().getTime();
  };

  if (quiz) {
    updateModified(quiz);
  } else if (question) {
    const quiz = _find(state.quizzes, (quiz) =>
      quiz.questions.includes(question.id)
    );
    if (quiz) {
      updateModified(quiz);
    }
  } else if (option) {
    const question = _find(state.questions, (question) =>
      question.options.includes(option.id)
    );
    if (question) {
      const quiz = _find(state.quizzes, (quiz) =>
        quiz.questions.includes(question.id)
      );
      if (quiz) {
        updateModified(quiz);
      }
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
    addQuestion(state, { payload: question }: PayloadAction<Question>) {
      state.questions.push(question);
    },
    renameQuestion(
      state,
      { payload: { id, text } }: PayloadAction<{ id: string; text: string }>
    ) {
      const question = _find(state.questions, { id });
      if (question) {
        question.text = text;
        updateModifiedQuiz(state, { question });
      }
    },
    removeQuestion(state, { payload: id }: PayloadAction<string>) {
      _remove(state.questions, { id });
    },
    addOption(state, { payload: option }: PayloadAction<Option>) {
      state.options.push(option);
    },
    renameOption(
      state,
      { payload: { id, text } }: PayloadAction<{ id: string; text: string }>
    ) {
      const option = _find(state.options, { id });
      if (option) {
        option.text = text;
        updateModifiedQuiz(state, { option });
      }
    },
    removeOption(state, { payload: id }: PayloadAction<string>) {
      _remove(state.options, { id });
    },
  },
});

const createQuizFromText = (text: string, quizzes: Quiz[]): Quiz => ({
  id: nanoid(),
  order: quizzes.length + 1,
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

export { createQuizFromText, createQuestionFromText };

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

export const selectQuizzes = (state: RootState) => state.quiz.quizzes;
export const selectQuestions = (quizId: string) => (state: RootState) => {
  console.log('selector reran');
  const quiz = _find(state.quiz.quizzes, { id: quizId });
  if (quiz) {
    try {
      return quiz.questions.map((questionId: string) => {
        const question = _find(state.quiz.questions, { id: questionId });
        if (question) {
          return question;
        } else {
          console.error(`quiz ${quizId} doesn't exist`);
          throw 'something went wrong';
        }
      });
    } catch (error) {
      return null;
    }
  } else {
    console.error(`quiz ${quizId} doesn't exist`);
    return null;
  }
};
export const selectQuizName = (quizId: string) => (state: RootState) => {
  const quiz = _find(state.quiz.quizzes, { id: quizId });
  if (quiz) {
    return quiz.text;
  }
};

export default quizSlice.reducer;
