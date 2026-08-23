function ErrorMessage({
  message = "Something went wrong. Please try again.",
}) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
      role="alert"
    >
      {message}
    </div>
  );
}

export default ErrorMessage;