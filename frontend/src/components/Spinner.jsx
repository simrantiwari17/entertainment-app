const Spinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 text-white">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
      <span>{label}</span>
    </div>
  );
};

export default Spinner;
