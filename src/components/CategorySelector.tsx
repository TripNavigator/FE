interface CategorySelectorProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const categories = ["식당", "카페"];

export default function CategorySelector({
    selectedCategory,
    onSelectCategory,
}: CategorySelectorProps) {
    return (
        <div style={{ display: "flex", gap: 10 }}>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    style={{
                        padding: "8px 16px",
                        fontSize: "14px",
                        borderRadius: "999px", // pill shape
                        border: "none",
                        backgroundColor: "#fff",
                        color: "#333",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                    }}
                    aria-label={category}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
