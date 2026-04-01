import StatsCard from "../common/StatsCard";
import Button from "../common/Button";

export default function StatsHero() {
  return (
    <div className="flex items-center justify-between px-8 py-10">
      <div>
        <div className="text-4xl font-bold leading-tight">
          Find Help, <span className="text-green-600">Offer Skills.</span>
          <br /> No money - just reciprocity.
        </div>
        <p className="mt-4 max-w-xl text-gray-500">
          Earn credits by helping others, spend them to get help yourself.
        </p>

        <div className="mt-6 flex gap-4">
          <Button>Post a Request</Button>
          <Button variant="secondary">How it works</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatsCard label="Active Requests" value="247" />
        <StatsCard label="Helpers Online" value="83" />
        <StatsCard label="Sessions Today" value="61" />
        <StatsCard label="Credits Exchanged" value="1.2k" />
      </div>
    </div>
  );
}
