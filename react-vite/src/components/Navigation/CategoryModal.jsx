import { useModal } from "../../context/Modal";
import "./CategoryModal.css"

function CategoryModal({ categories, onSelect }) {
  const { closeModal } = useModal();

  const handleCategoryClick = (categoryId) => {
    onSelect(categoryId);
    closeModal();
  };

  return (
    <div className="category-modal">
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="category-button"
          >
            {category.category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryModal;
