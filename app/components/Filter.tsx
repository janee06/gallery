'use client';

const Filter = ({
  categories,
  setFilter,
}: {
  categories: string[];
  setFilter: (category: string) => void;
}) => (
  <div className="flex justify-center space-x-4 mb-6">
    {categories.map(category => (
      <button
        key={category}
        onClick={() => setFilter(category)}
        className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-medium transition-colors duration-300"
      >
        {category}
      </button>
    ))}
  </div>
);

export default Filter;