const SkeletonLoader = () => {
    return (
      <div className="p-4">
        <div className="bg-secondary bg-opacity-25 rounded mb-3" style={{ height: '20px', width: '60%' }}></div>
        <div className="bg-secondary bg-opacity-25 rounded mb-2" style={{ height: '15px', width: '90%' }}></div>
        <div className="bg-secondary bg-opacity-25 rounded mb-2" style={{ height: '15px', width: '85%' }}></div>
        <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '15px', width: '80%' }}></div>
      </div>
    );
  };
  
  export default SkeletonLoader;
  