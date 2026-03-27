// ============================================
// SkeletonCard.jsx — Loading placeholder
// ============================================
// Shows an animated gray outline of a video card while data fetches.

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm animate-pulse border border-gray-100 dark:border-gray-800">
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 w-full" />

      {/* Info placeholder */}
      <div className="p-3">
        <div className="flex gap-3 mt-1">
          {/* Avatar placeholder */}
          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
          
          {/* Text lines */}
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
