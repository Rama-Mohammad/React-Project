import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  color?: 'blue' | 'gray' | 'white';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  variant = 'spinner',
  color = 'blue',
  fullScreen = false,
  text,
  className = '',
}) => {
  const sizeClasses = {
    small: {
      spinner: 'w-4 h-4',
      dots: 'w-1.5 h-1.5',
      pulse: 'w-8 h-8',
      skeleton: 'h-4',
    },
    medium: {
      spinner: 'w-8 h-8',
      dots: 'w-2 h-2',
      pulse: 'w-12 h-12',
      skeleton: 'h-6',
    },
    large: {
      spinner: 'w-12 h-12',
      dots: 'w-3 h-3',
      pulse: 'w-16 h-16',
      skeleton: 'h-8',
    },
  };

  const colorClasses = {
    blue: {
      spinner: 'text-blue-600',
      dots: 'bg-blue-600',
      pulse: 'bg-blue-600',
      skeleton: 'bg-blue-100',
    },
    gray: {
      spinner: 'text-gray-600',
      dots: 'bg-gray-600',
      pulse: 'bg-gray-600',
      skeleton: 'bg-gray-100',
    },
    white: {
      spinner: 'text-white',
      dots: 'bg-white',
      pulse: 'bg-white',
      skeleton: 'bg-white/20',
    },
  };

  const renderSpinner = () => (
    <div className="inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((dot) => (
        <div
          key={dot}
          className={`rounded-full animate-bounce ${colorClasses[color].dots}`}
          style={{
            width: sizeClasses[size].dots,
            height: sizeClasses[size].dots,
            animationDelay: `${dot * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className="relative">
      <div
        className={`rounded-full animate-ping opacity-75 ${colorClasses[color].pulse}`}
        style={{
          width: sizeClasses[size].pulse,
          height: sizeClasses[size].pulse,
        }}
      />
      <div
        className={`rounded-full absolute top-0 left-0 ${colorClasses[color].pulse}`}
        style={{
          width: sizeClasses[size].pulse,
          height: sizeClasses[size].pulse,
          opacity: 0.5,
        }}
      />
    </div>
  );

  const renderSkeleton = () => {
    const widthClasses = {
      small: 'w-24',
      medium: 'w-32',
      large: 'w-48',
    };

    return (
      <div className="space-y-2">
        <div
          className={`${colorClasses[color].skeleton} rounded animate-pulse ${widthClasses[size]} ${sizeClasses[size].skeleton}`}
        />
        <div
          className={`${colorClasses[color].skeleton} rounded animate-pulse ${widthClasses[size]} ${sizeClasses[size].skeleton}`}
          style={{ width: '80%' }}
        />
        <div
          className={`${colorClasses[color].skeleton} rounded animate-pulse ${widthClasses[size]} ${sizeClasses[size].skeleton}`}
          style={{ width: '60%' }}
        />
      </div>
    );
  };

  const variants = {
    spinner: renderSpinner,
    dots: renderDots,
    pulse: renderPulse,
    skeleton: renderSkeleton,
  };

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {variants[variant]()}
      {text && (
        <p
          className={`text-sm ${
            color === 'white' ? 'text-white' : 'text-gray-500'
          } animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

// Skeleton Card Variant
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <Loader variant="skeleton" size="small" className="w-16" />
            <Loader variant="skeleton" size="small" className="w-12" />
          </div>
          <Loader variant="skeleton" size="medium" className="w-3/4" />
        </div>
        <Loader variant="skeleton" size="small" className="w-12" />
      </div>
      <Loader variant="skeleton" size="small" className="w-full mb-2" />
      <Loader variant="skeleton" size="small" className="w-5/6 mb-3" />
      <div className="flex gap-2 mb-3">
        <Loader variant="skeleton" size="small" className="w-16" />
        <Loader variant="skeleton" size="small" className="w-20" />
        <Loader variant="skeleton" size="small" className="w-14" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Loader variant="skeleton" size="small" className="w-8 h-8 rounded-full" />
          <Loader variant="skeleton" size="small" className="w-24" />
        </div>
        <Loader variant="skeleton" size="small" className="w-20" />
      </div>
    </div>
  );
};

// Skeleton List Variant
export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

// Skeleton Table Variant
export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <Loader variant="skeleton" size="medium" className="w-48" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, idx) => (
                <th key={idx} className="px-6 py-3">
                  <Loader variant="skeleton" size="small" className="w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <Loader variant="skeleton" size="small" className="w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Skeleton Stats Card
export const SkeletonStatsCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <Loader variant="skeleton" size="small" className="w-8 h-8 rounded-full" />
        <Loader variant="skeleton" size="small" className="w-20" />
      </div>
      <Loader variant="skeleton" size="large" className="w-3/4 mb-2" />
      <Loader variant="skeleton" size="small" className="w-32" />
    </div>
  );
};

// Page Loader (full page with fade in)
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader size="large" variant="spinner" color="blue" />
        <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
      </div>
    </div>
  );
};

// Overlay Loader
export const OverlayLoader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
      <Loader size="medium" variant="spinner" text={message} />
    </div>
  );
};

export default Loader;