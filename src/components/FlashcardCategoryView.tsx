
import React from 'react';
import { useFlashcards } from '../context/FlashcardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';

const FlashcardCategoryView = () => {
  const { flashcards, filterByCategory, setFilterByCategory, setCurrentCardIndex, deleteFlashcard } = useFlashcards();

  const categories = [
    { value: 'unrated', label: 'Unrated' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const getCountByCategory = (category: string) => {
    return flashcards.filter(card => card.category === category).length;
  };

  const handleCardClick = (cardId: number) => {
    const index = flashcards.findIndex(card => card.id === cardId);
    if (index !== -1) {
      setCurrentCardIndex(index);
      setFilterByCategory(null);
    }
  };

  const handleDeleteCard = (cardId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteFlashcard(cardId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Flashcards by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={filterByCategory === null ? 'default' : 'outline'}
              onClick={() => setFilterByCategory(null)}
            >
              All ({flashcards.length})
            </Button>
            {categories.map(category => (
              <Button
                key={category.value}
                variant={filterByCategory === category.value ? 'default' : 'outline'}
                onClick={() => setFilterByCategory(category.value as any)}
              >
                {category.label} ({getCountByCategory(category.value)})
              </Button>
            ))}
          </div>

          {flashcards.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Front</TableHead>
                  <TableHead>Back</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filterByCategory ? flashcards.filter(card => card.category === filterByCategory) : flashcards).map(card => (
                  <TableRow 
                    key={card.id} 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCardClick(card.id)}
                  >
                    <TableCell className="font-medium">{card.front}</TableCell>
                    <TableCell>{card.back}</TableCell>
                    <TableCell>
                      <span className={
                        card.category === 'easy' ? 'text-green-500' :
                        card.category === 'medium' ? 'text-blue-500' :
                        card.category === 'hard' ? 'text-red-500' :
                        'text-gray-500'
                      }>
                        {card.category.charAt(0).toUpperCase() + card.category.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={(e) => handleDeleteCard(card.id, e)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-gray-500">No flashcards available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashcardCategoryView;
