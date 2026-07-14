import { Search } from 'lucide-react';

interface EmptySearchProps {
  query: string;
}

export function EmptySearch({ query }: EmptySearchProps) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4 animate-fade-up">
      <div className="w-20 h-20 bg-warm-beige rounded-full flex items-center justify-center mb-6">
        <Search className="w-8 h-8 text-temple-red" />
      </div>
      <h2 className="text-2xl font-heading font-semibold text-deep-brown mb-3">
        No results found for "{query}"
      </h2>
      <p className="text-muted-brown font-body max-w-md mx-auto mb-8">
        We couldn't find any products matching your search. Try checking your spelling or using more general terms.
      </p>
      
      <div className="text-sm font-body">
        <p className="text-brown font-semibold mb-3">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Ganesha', 'Buddha', 'Bronze', 'Marble', 'Temple'].map((term) => (
            <span 
              key={term} 
              className="px-4 py-2 bg-cream border border-border/50 rounded-full text-muted-brown"
            >
              {term}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
