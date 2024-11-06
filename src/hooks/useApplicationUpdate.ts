import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useApplicationUpdate = () => {
  const [progress, setProgress] = useState(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Загрузка...');
  const navigate = useNavigate();

  useEffect(() => {
    ipcRenderer.on('checking-for-update', () => {
      setStatusMessage('Проверка обновлений...');
    });

    ipcRenderer.on('update-available', (_, info) => {
      setStatusMessage(`Загрузка обновления: версия ${info.version}`);
      setUpdateAvailable(true);
      navigate('/');
    });

    ipcRenderer.on('update-not-available', () => {
      navigate('/main'); 
    });

    ipcRenderer.on('update-progress', (_, percent) => {
      setProgress(Math.round(percent));
    });

    return () => {
      ipcRenderer.removeAllListeners('checking-for-update');
      ipcRenderer.removeAllListeners('update-available');
      ipcRenderer.removeAllListeners('update-not-available');
      ipcRenderer.removeAllListeners('update-progress');
    };
  }, [navigate]);

  return { progress, updateAvailable, statusMessage };
}

export default useApplicationUpdate;
