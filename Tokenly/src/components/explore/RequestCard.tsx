import Button from "../common/Button";
import Badge from "../common/Badge";

export default function RequestCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-white p-5">
      <div className="flex justify-between">
        <Badge>Programming</Badge>
        <span className="text-sm text-red-500">High urgency</span>
      </div>

      <h3 className="text-lg font-semibold">
        Debug my React useEffect causing infinite re-renders
      </h3>

      <p className="text-sm text-gray-500">
        I have a component that keeps re-rendering infinitely...
      </p>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        <Badge>React</Badge>
        <Badge>JavaScript</Badge>
        <Badge>Hooks</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-400">30 min - 3 offers</span>
        <Button className="px-3 py-1 text-sm">View</Button>
      </div>
    </div>
  );
}
