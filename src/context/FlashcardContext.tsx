
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Flashcard, flashcards as initialFlashcards, FlashcardCategory } from '../data/flashcards';

interface FlashcardContextType {
  flashcards: Flashcard[];
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  addFlashcard: (front: string, back: string) => void;
  updateFlashcardCategory: (id: number, category: FlashcardCategory) => void;
  deleteFlashcard: (id: number) => void;
  goToNextCard: () => void;
  goToPreviousCard: () => void;
  filterByCategory: FlashcardCategory | null;
  setFilterByCategory: (category: FlashcardCategory | null) => void;
  filteredFlashcards: Flashcard[];
  resetCardIndex: () => void;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const savedFlashcards = localStorage.getItem('flashcards');
    return savedFlashcards ? JSON.parse(savedFlashcards) : initialFlashcards;
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [filterByCategory, setFilterByCategory] = useState<FlashcardCategory | null>(null);

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const filteredFlashcards = filterByCategory 
    ? flashcards.filter(card => card.category === filterByCategory) 
    : flashcards;

  const addFlashcard = (front: string, back: string) => {
    const newFlashcard: Flashcard = {
      id: Date.now(),
      front,
      back,
      category: 'unrated'
    };
    setFlashcards([...flashcards, newFlashcard]);
  };

  const updateFlashcardCategory = (id: number, category: FlashcardCategory) => {
    setFlashcards(
      flashcards.map(card => 
        card.id === id ? { ...card, category } : card
      )
    );
  };

  const deleteFlashcard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
    
    // Adjust current card index if needed
    if (currentCardIndex >= filteredFlashcards.length - 1 && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const goToNextCard = () => {
    if (currentCardIndex < filteredFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const resetCardIndex = () => {
    setCurrentCardIndex(0);
  };

  return (
    <FlashcardContext.Provider 
      value={{ 
        flashcards, 
        currentCardIndex, 
        setCurrentCardIndex,
        addFlashcard, 
        updateFlashcardCategory,
        deleteFlashcard,
        goToNextCard, 
        goToPreviousCard,
        filterByCategory,
        setFilterByCategory,
        filteredFlashcards,
        resetCardIndex
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};
