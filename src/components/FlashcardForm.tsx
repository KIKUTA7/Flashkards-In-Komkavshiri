
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useFlashcards } from '../context/FlashcardContext';
import { toast } from '@/hooks/use-toast';

const FlashcardForm: React.FC = () => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const { addFlashcard } = useFlashcards();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() === '' || back.trim() === '') {
      toast({
        title: "Invalid Input",
        description: "Both sides of the flashcard must have content.",
        variant: "destructive",
      });
      return;
    }

    addFlashcard(front, back);
    toast({
      title: "Flashcard Added",
      description: "Your new flashcard has been created.",
    });
    setFront('');
    setBack('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Flashcard</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="front" className="block text-sm font-medium mb-1">
              Front (Question)
            </label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Enter the question or term..."
              className="resize-none"
            />
          </div>
          <div>
            <label htmlFor="back" className="block text-sm font-medium mb-1">
              Back (Answer)
            </label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Enter the answer or definition..."
              className="resize-none"
            />
          </div>
          <Button type="submit">Add Flashcard</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FlashcardForm;
