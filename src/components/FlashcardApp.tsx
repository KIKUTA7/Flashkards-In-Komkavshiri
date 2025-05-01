
import React, { useState, useEffect, useCallback } from 'react';
import Flashcard from './Flashcard';
import Camera from './Camera';
import FlashcardForm from './FlashcardForm';
import FlashcardCategoryView from './FlashcardCategoryView';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useFlashcards } from '../context/FlashcardContext';
import { Tab } from '@/components/ui/tab';
import { Tabs } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Hand, Timer, Trash, 
  Camera as CameraIcon,
  Tally1, Tally2, Tally3
} from 'lucide-react';

const FlashcardApp: React.FC = () => {
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [gestureActionDelay, setGestureActionDelay] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");
  const [gestureCooldown, setGestureCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(3);
  const [isCurrentCardFlipped, setIsCurrentCardFlipped] = useState(false);

  const { 
    filteredFlashcards, 
    currentCardIndex, 
    setCurrentCardIndex,
    goToNextCard, 
    goToPreviousCard,
    updateFlashcardCategory,
    deleteFlashcard,
    resetCardIndex
  } = useFlashcards();

  const handleGestureDetected = useCallback((gesture: string | null) => {
    setDetectedGesture(gesture);
  }, []);

  // Reset card to front side when navigating
  useEffect(() => {
    setIsCurrentCardFlipped(false);
  }, [currentCardIndex]);

  // Handle category assignment based on gestures
  useEffect(() => {
    if (!gesturesEnabled || gestureActionDelay || filteredFlashcards.length === 0 || gestureCooldown) return;
    
    const currentCard = filteredFlashcards[currentCardIndex];
    let categoryChanged = false;
    let categoryName = '';

    if (detectedGesture === 'one_finger') {
      updateFlashcardCategory(currentCard.id, 'easy');
      categoryName = 'Easy';
      categoryChanged = true;
    } else if (detectedGesture === 'two_fingers') {
      updateFlashcardCategory(currentCard.id, 'medium');
      categoryName = 'Medium';
      categoryChanged = true;
    } else if (detectedGesture === 'three_fingers') {
      updateFlashcardCategory(currentCard.id, 'hard');
      categoryName = 'Hard';
      categoryChanged = true;
    }

    if (categoryChanged) {
      toast({
        title: `Card Categorized as ${categoryName}`,
        description: `This flashcard has been moved to the ${categoryName} category`,
      });
      
      setGestureActionDelay(true);
      setTimeout(() => {
        setGestureActionDelay(false);
        goToNextCard();
      }, 1500);
    }
  }, [detectedGesture, gesturesEnabled, gestureActionDelay, currentCardIndex, filteredFlashcards, updateFlashcardCategory, goToNextCard, gestureCooldown]);

  // Implement cooldown timer for gesture detection
  useEffect(() => {
    let intervalId: number;
    
    if (gestureCooldown && cooldownSeconds > 0) {
      intervalId = window.setInterval(() => {
        setCooldownSeconds(prev => prev - 1);
      }, 1000);
    } else if (cooldownSeconds === 0) {
      setGestureCooldown(false);
      setCooldownSeconds(3);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gestureCooldown, cooldownSeconds]);

  // Start cooldown when moving to next card
  useEffect(() => {
    if (gesturesEnabled && filteredFlashcards.length > 0) {
      setGestureCooldown(true);
      setCooldownSeconds(3);
    }
  }, [currentCardIndex, gesturesEnabled, filteredFlashcards.length]);

  const toggleGestures = () => {
    setGesturesEnabled(!gesturesEnabled);
    if (!gesturesEnabled) {
      setGestureCooldown(true);
      setCooldownSeconds(3);
    }
    
    toast({
      title: gesturesEnabled ? "Gestures Disabled" : "Gestures Enabled",
      description: gesturesEnabled 
        ? "Hand gesture controls turned off"
        : "Use gestures to categorize flashcards",
    });
  };

  // Handle manual categorization
  const categorizeCard = (category: 'easy' | 'medium' | 'hard') => {
    if (filteredFlashcards.length === 0) return;
    
    const currentCard = filteredFlashcards[currentCardIndex];
    updateFlashcardCategory(currentCard.id, category);
    
    toast({
      title: `Card Categorized`,
      description: `This flashcard has been marked as ${category}`,
    });
    
    setTimeout(() => {
      goToNextCard();
    }, 500);
  };

  // Handle card deletion
  const handleDeleteCard = () => {
    if (filteredFlashcards.length === 0) return;
    
    const currentCard = filteredFlashcards[currentCardIndex];
    deleteFlashcard(currentCard.id);
    
    toast({
      title: "Card Deleted",
      description: "The flashcard has been removed",
      variant: "destructive"
    });
  };

  // Handle card flip
  const handleCardFlip = (isFlipped: boolean) => {
    setIsCurrentCardFlipped(isFlipped);
  };

  // Restart practice session
  const handleRestartPractice = () => {
    resetCardIndex();
    toast({
      title: "Practice Restarted",
      description: "Starting from the first flashcard",
    });
  };

  const isLastCard = currentCardIndex === filteredFlashcards.length - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Flashcard App with Gestures</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <Tab.List className="grid grid-cols-3 mb-8">
          <Tab.Trigger value="practice" className="text-center py-2">Practice Cards</Tab.Trigger>
          <Tab.Trigger value="add" className="text-center py-2">Add New</Tab.Trigger>
          <Tab.Trigger value="browse" className="text-center py-2">Browse All</Tab.Trigger>
        </Tab.List>
        
        <Tab.Content value="practice">
          {filteredFlashcards.length > 0 ? (
            <>
              <div className="w-full max-w-2xl mb-8">
                <Flashcard card={filteredFlashcards[currentCardIndex]} onFlip={handleCardFlip} forceShowFront={!isCurrentCardFlipped} />
              </div>
              
              {/* Navigation buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-6 w-full">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousCard} 
                  disabled={currentCardIndex === 0}
                >
                  Previous Card
                </Button>
                
                <Button 
                  onClick={toggleGestures} 
                  variant={gesturesEnabled ? "destructive" : "default"}
                >
                  <CameraIcon className="mr-2 h-4 w-4" />
                  {gesturesEnabled ? "Disable Gestures" : "Enable Gestures"}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={goToNextCard} 
                  disabled={currentCardIndex === filteredFlashcards.length - 1}
                >
                  Next Card
                </Button>

                <Button 
                  variant="destructive" 
                  onClick={handleDeleteCard}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Card
                </Button>
              </div>
              
              {/* Card counter */}
              <div className="text-center mb-4">
                <p>Card {currentCardIndex + 1} of {filteredFlashcards.length}</p>
              </div>
              
              {/* Show restart button when finished with all cards */}
              {isLastCard && (
                <Button onClick={handleRestartPractice} variant="default" className="mb-4">
                  Restart Practice
                </Button>
              )}
              
              {/* Categorization buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Categorize this card</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button onClick={() => categorizeCard('easy')} variant="outline" className="bg-green-100 hover:bg-green-200">
                      <Tally1 className="mr-2 h-4 w-4" /> Easy
                    </Button>
                    <Button onClick={() => categorizeCard('medium')} variant="outline" className="bg-blue-100 hover:bg-blue-200">
                      <Tally2 className="mr-2 h-4 w-4" /> Medium
                    </Button>
                    <Button onClick={() => categorizeCard('hard')} variant="outline" className="bg-red-100 hover:bg-red-200">
                      <Tally3 className="mr-2 h-4 w-4" /> Hard
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Gesture guide */}
              {gesturesEnabled && (
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Gesture Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                        <div className="flex items-center"><Tally1 className="mr-2 h-4 w-4" /> 1 Finger = Easy</div>
                        <div className="flex items-center"><Tally2 className="mr-2 h-4 w-4" /> 2 Fingers = Medium</div>
                        <div className="flex items-center"><Tally3 className="mr-2 h-4 w-4" /> 3 Fingers = Hard</div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Current gesture:</strong> {detectedGesture || "None detected"}
                      </p>
                      {gestureCooldown && (
                        <div className="flex items-center mt-2 text-amber-600 font-semibold">
                          <Timer className="mr-2 h-4 w-4" /> Ready in {cooldownSeconds}s
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-8 bg-gray-100 rounded-lg">
              <p className="text-xl mb-4">No flashcards available</p>
              <Button onClick={() => setActiveTab("add")}>Create your first flashcard</Button>
            </div>
          )}
        </Tab.Content>
        
        <Tab.Content value="add">
          <FlashcardForm />
        </Tab.Content>
        
        <Tab.Content value="browse">
          <FlashcardCategoryView />
        </Tab.Content>
      </Tabs>

      <Camera 
        onGestureDetected={handleGestureDetected} 
        isEnabled={gesturesEnabled && !gestureCooldown} 
        cooldownActive={gestureCooldown}
        cooldownSeconds={cooldownSeconds}
      />
    </div>
  );
};

export default FlashcardApp;
