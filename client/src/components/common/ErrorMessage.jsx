function ErrorMessage({
  message = "Something went wrong. Please try again.",
}) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
      role="alert"
    >
      {message}
    </div>
  );
}

export default ErrorMessage;