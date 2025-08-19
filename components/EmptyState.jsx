"use client";

import React from "react";

const EmptyState = ({ 
  title = "No data found",
  description = "There's nothing to display at the moment.",
  icon = "📭",
  action = null,
  secondaryAction = null,
  illustration = null,
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "py-8 px-6",
    md: "py-12 px-8", 
    lg: "py-16 px-12"
  };

  const iconSizes = {
    sm: "text-4xl",
    md: "text-6xl",
    lg: "text-8xl"
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const descriptionSizes = {
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg"
  };

  return (
    <div className={`text-center ${sizeClasses[size]} ${className}`}>
      {/* Illustration or Icon */}
      {illustration ? (
        <div className="mb-6">
          {illustration}
        </div>
      ) : (
        <div className={`${iconSizes[size]} mb-4 text-gray-400 dark:text-gray-500`}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="max-w-md mx-auto">
        <h3 className={`${titleSizes[size]} font-semibold text-gray-900 dark:text-gray-100 mb-2`}>
          {title}
        </h3>
        <p className={`${descriptionSizes[size]} text-gray-500 dark:text-gray-400 mb-6`}>
          {description}
        </p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {action && (
              <button
                onClick={action.onClick}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            )}
            
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {secondaryAction.icon && <span className="mr-2">{secondaryAction.icon}</span>}
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Pre-built Empty States for common scenarios
export const EmptyApplications = ({ onCreateApplication, onBrowseJobs }) => (
  <EmptyState
    title="No applications yet"
    description="Start your job search journey by browsing available positions and submitting your first application."
    icon="📋"
    action={{
      label: "Browse Jobs",
      icon: "🔍",
      onClick: onBrowseJobs
    }}
    secondaryAction={{
      label: "Create Profile",
      icon: "👤",
      onClick: onCreateApplication
    }}
    size="lg"
  />
);

export const EmptyInterviews = ({ onScheduleInterview, onViewCalendar }) => (
  <EmptyState
    title="No interviews scheduled"
    description="You don't have any interviews scheduled yet. Check your calendar or schedule a new interview."
    icon="📅"
    action={{
      label: "Schedule Interview",
      icon: "➕",
      onClick: onScheduleInterview
    }}
    secondaryAction={{
      label: "View Calendar",
      icon: "📊",
      onClick: onViewCalendar
    }}
    size="lg"
  />
);

export const EmptyJobPosts = ({ onCreateJob, onImportJobs }) => (
  <EmptyState
    title="No job posts yet"
    description="Get started by creating your first job posting or importing existing positions."
    icon="💼"
    action={{
      label: "Create Job Post",
      icon: "➕",
      onClick: onCreateJob
    }}
    secondaryAction={{
      label: "Import Jobs",
      icon: "📥",
      onClick: onImportJobs
    }}
    size="lg"
  />
);

export const EmptyNotifications = ({ onMarkAllRead, onSettings }) => (
  <EmptyState
    title="All caught up!"
    description="You don't have any new notifications. Check back later for updates."
    icon="🔔"
    action={{
      label: "Notification Settings",
      icon: "⚙️",
      onClick: onSettings
    }}
    secondaryAction={{
      label: "View All",
      icon: "📋",
      onClick: onMarkAllRead
    }}
    size="md"
  />
);

export const EmptySearchResults = ({ 
  searchTerm, 
  onClearFilters, 
  onSuggestions 
}) => (
  <EmptyState
    title={`No results for "${searchTerm}"`}
    description="Try adjusting your search terms or filters to find what you're looking for."
    icon="🔍"
    action={{
      label: "Clear Filters",
      icon: "🔄",
      onClick: onClearFilters
    }}
    secondaryAction={{
      label: "View Suggestions",
      icon: "💡",
      onClick: onSuggestions
    }}
    size="md"
  />
);

export const EmptyTable = ({ 
  title = "No data available",
  description = "There are no items to display in this table.",
  onCreateNew,
  onRefresh,
  columns = 4
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    {/* Table Header */}
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
      <div className="flex space-x-6">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="w-24 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        ))}
      </div>
    </div>
    
    {/* Empty State */}
    <div className="py-12 px-6">
      <EmptyState
        title={title}
        description={description}
        icon="📊"
        action={onCreateNew ? {
          label: "Create New",
          icon: "➕",
          onClick: onCreateNew
        } : null}
        secondaryAction={onRefresh ? {
          label: "Refresh",
          icon: "🔄",
          onClick: onRefresh
        } : null}
        size="md"
      />
    </div>
  </div>
);

export default EmptyState;
