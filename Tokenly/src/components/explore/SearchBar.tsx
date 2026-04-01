export default function SearchBar() {
  return (
    <div className="flex gap-4 px-8">
      <input
        placeholder="Search by title, skill, or keyword..."
        className="flex-1 border rounded-lg px-4 py-3"
      />
      <select className="border rounded-lg px-4">
        <option>Newest</option>
      </select>
    </div>
  );
}