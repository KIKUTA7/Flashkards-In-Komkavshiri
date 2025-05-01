
export type FlashcardCategory = 'unrated' | 'easy' | 'medium' | 'hard';

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: FlashcardCategory;
}

export const flashcards: Flashcard[] = [
  {
    id: 1,
    front: "What is React?",
    back: "A JavaScript library for building user interfaces",
    category: 'unrated'
  },
  {
    id: 2,
    front: "What is JSX?",
    back: "A syntax extension for JavaScript that looks similar to HTML",
    category: 'unrated'
  },
  {
    id: 3,
    front: "What is a component?",
    back: "An independent, reusable piece of code that returns React elements",
    category: 'unrated'
  },
  {
    id: 4,
    front: "What are props?",
    back: "Short for properties, they are read-only inputs to components",
    category: 'unrated'
  },
  {
    id: 5,
    front: "What is state?",
    back: "An object that stores data that may change over time",
    category: 'unrated'
  }
];
