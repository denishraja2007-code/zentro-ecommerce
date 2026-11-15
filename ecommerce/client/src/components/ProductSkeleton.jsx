export default function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="h-52 w-full bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-10 rounded bg-gray-200" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 rounded bg-gray-200" />
          <div className="h-9 w-16 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}