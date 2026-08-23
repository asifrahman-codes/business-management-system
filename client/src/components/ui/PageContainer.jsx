function PageContainer({ children }) {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      {children}
    </main>
  );
}

export default PageContainer;