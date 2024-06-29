import { useEffect, useState } from "react";

const Image = ({ src: url, alt, storageId, className, delayed = false }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      let storedSrc = localStorage.getItem(storageId);

      if (!storedSrc && delayed) {
        for (let i = 0; i < 5; i++) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          storedSrc = localStorage.getItem(storageId);
          if (storedSrc) break;
        }
      }

      if (storedSrc) {
        setSrc(storedSrc);
      } else {
        fetch(`https://corsproxy.io/?${url}`)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              setSrc(reader.result);
              localStorage.setItem(storageId, reader.result);
            };
          })
          .catch((error) => {
            // failed to fetch image
            setSrc(url);
          });
      }
    };

    fetchImage();
  }, [delayed, storageId, url]);

  return src != null && <img src={src} alt={alt} className={className} />;
};

export default Image;
