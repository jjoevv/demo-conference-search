import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const AutoProgressBar = ({ loading }) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval;

    const increaseProgress = () => {
      // Tính toán lượng tăng thêm
      const increment = Math.random() < 0.5 ? 3 : 5;
      const newProgress = progress + increment;

      if (newProgress >= 100) {
        clearInterval(interval); // Dừng interval khi đạt hoặc vượt quá 100%
      } else {
        setProgress(newProgress);
      }
    };

    if (loading && progress < 100 && !completed) {
      interval = setInterval(increaseProgress, 1000);
    }

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [progress, loading, completed]);

  useEffect(() => {
    // Nếu loading được set thành false khi progress đang chạy
    if (!loading && progress < 100 && !completed) {
      // Đợi để cập nhật progress lên 100
      const timeout = setTimeout(() => {
        setProgress(100);
        setCompleted(true);
      }, 1000); // Chờ 1 giây để đảm bảo đã dừng interval hoàn toàn

      return () => clearTimeout(timeout); // Dọn dẹp timeout khi component unmount
    }
  }, [loading, progress, completed]);

  return (
    <div className="my-3">
      <ProgressBar animated now={progress} label={`${progress}%`} className='custom-progress'/>
      {completed && <div className="text-center mt-2">Loading complete!</div>}
    </div>
  );
};

export default AutoProgressBar;
