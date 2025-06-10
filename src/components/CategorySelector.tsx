import type { Category } from "../types/Category";

interface CategorySelectorProps {
    selectedCategory: Category | null;
    onSelectCategory: (category: Category) => void;
}

const categories: Category[] = [
    { name: "식당", code: "FD6" },
    { name: "카페", code: "CE7" },
    { name: "편의점", code: "CS2" },
    { name: "관광명소", code: "AT4" },
    { name: "대형마트", code: "MT1" },
    { name: "약국", code: "PM9" },
    { name: "병원", code: "HP8" },
];

export default function CategorySelector({
    selectedCategory,
    onSelectCategory,
}: CategorySelectorProps) {
    return (
        <div
            style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}
        >
            {categories.map((category) => (
                <button
                    key={category.code}
                    onClick={() => onSelectCategory(category)}
                    style={{
                        padding: "8px 16px",
                        fontSize: "14px",
                        borderRadius: "999px",
                        border: "none",
                        backgroundColor:
                            selectedCategory?.code === category.code
                                ? "#007bff"
                                : "#fff",
                        color:
                            selectedCategory?.code === category.code
                                ? "#fff"
                                : "#333",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                    }}
                    aria-label={category.name}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
