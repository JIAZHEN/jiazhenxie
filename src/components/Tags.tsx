import { motion } from "framer-motion";

interface TagsProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function Tags({ tags, selectedTag, onTagSelect }: TagsProps) {
  // Get unique tags and sort them alphabetically
  const uniqueTags = [...new Set(tags)].sort();

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onTagSelect(null)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedTag === null
            ? "bg-primary-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-500 hover:text-white"
        }`}
      >
        All
      </motion.button>
      {uniqueTags.map((tag) => (
        <motion.button
          key={tag}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTagSelect(tag)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedTag === tag
              ? "bg-primary-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-500 hover:text-white"
          }`}
        >
          {tag}
        </motion.button>
      ))}
    </div>
  );
}
