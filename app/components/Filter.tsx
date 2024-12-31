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
        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors duration-300"
      >
        {category}
      </button>
    ))}
  </div>
);

export default Filter;