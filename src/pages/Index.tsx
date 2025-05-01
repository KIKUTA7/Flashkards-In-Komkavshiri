
import FlashcardApp from '../components/FlashcardApp';
import { FlashcardProvider } from '../context/FlashcardContext';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <FlashcardProvider>
        <FlashcardApp />
      </FlashcardProvider>
    </div>
  );
};

export default Index;
