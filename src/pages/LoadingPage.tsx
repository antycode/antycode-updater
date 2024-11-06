const LoadingPage = ({ progress, statusMessage, updateAvailable }: any) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{fontSize: "34px"}}>{statusMessage}</h1>
      {updateAvailable && (
        <>
          <div style={{ width: '100%', background: '#f3f3f3', borderRadius: '5px' }}>
            <div
              style={{
                height: '20px',
                width: `${progress}%`,
                background: '#4caf50',
                borderRadius: '5px',
              }}
            />
          </div>
          <p>{Math.round(progress)}%</p>
        </>
      )}
    </div>
  );
};

export default LoadingPage;
