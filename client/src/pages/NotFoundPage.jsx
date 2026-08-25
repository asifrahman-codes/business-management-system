function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">
          404
        </h1>

        <p className="mt-3 text-lg font-medium text-gray-700 dark:text-gray-200">
          Page Not Found
        </p>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;