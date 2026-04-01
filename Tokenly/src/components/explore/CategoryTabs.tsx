const categories = [
  "All",
  "Programming",
  "Mathematics",
  "Machine Learning",
  "Data Science",
  "Web Development",
  "Algorithms",
];

export default function CategoryTabs() {
  return (
    <div className="flex gap-3 px-8 mt-4 flex-wrap">
      {categories.map((c, i) => (
        <div
          key={c}
          className={`px-4 py-2 rounded-full border cursor-pointer ${
            i === 0 ? "bg-green-600 text-white" : "bg-white"
          }`}
        >
          {c}
        </div>
      ))}
    </div>
  );
}