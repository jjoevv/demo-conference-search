import './custom_loading.css'
const LoadingConferences = ({ onReload }) => {
  return (
    <div>
      <div className="loading-container">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
    </div>
  )
}

export default LoadingConferences