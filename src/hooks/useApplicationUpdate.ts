import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useApplicationUpdate = () => {
  const [progress, setProgress] = useState(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Загрузка...');
  const navigate = useNavigate();

  useEffect(() => {
    if (process.env['VITE_DEV_SERVER_URL']) {
      setTimeout(() => navigate('/main'), 2000);
      return;
    }

      ipcRenderer.on('checking-for-update', () => {
        setStatusMessage('Проверка обновлений...');
      });
  
      ipcRenderer.on('update-available', (_, info) => {
        const platform = process.platform;
        const updateVersion = info.version;
        console.log('info', info);
  
        // Проверка доступности обновления для текущей системы
        const isFormatAvailable = (platform === 'darwin' && info.files.some((file:any) => file.url.includes('mac')))
          || (platform === 'win32' && info.files.some((file:any) => file.url.includes('exe') || file.url.includes('win')));
        console.log(info)
        if (isFormatAvailable) {
          setStatusMessage(`Загрузка обновления: версия ${updateVersion}`);
          setUpdateAvailable(true);
        } else {
          setStatusMessage(`Обновление версии ${updateVersion} недоступно для вашей системы`);
          setTimeout(() => navigate('/main'), 2000);
        }
      });
  
      ipcRenderer.on('update-not-available', () => {
        navigate('/main'); 
      });
  
      ipcRenderer.on('update-progress', (_, percent) => {
        setProgress(Math.round(percent));
      });
      ipcRenderer.on('error', (_, error) => {
        console.log('error update', error);
        
        // Проверяем текст ошибки, чтобы понять, какой файл не найден
        if (error.message.includes("Cannot find latest.yml") || error.message.includes("Cannot find latest-mac.yml")) {
          setStatusMessage("Файл обновления недоступен для вашей системы.");
        } else {
          setStatusMessage("Произошла ошибка при загрузке обновления.");
        }
        setTimeout(() => navigate('/main'), 3000);
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
