import { useEffect, useState } from "react";

const Image = ({ src: url, alt, storageId, className, delayed = false }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      let storedSrc = localStorage.getItem(storageId);

      if (!storedSrc && delayed) {
        await new Promise((resolve) => setTimeout(resolve, 750));
        storedSrc = localStorage.getItem(storageId);
      }

      if (storedSrc) {
        setSrc(storedSrc);
      } else {
        setSrc(url);
        fetch(`https://corsproxy.io/?${url}`)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              localStorage.setItem(storageId, reader.result);
            };
          })
          .catch((error) => {
            // failed to fetch image
          });
      }
    };

    fetchImage();
  }, [delayed, storageId, url]);

  return src != null && <img src={src} alt={alt} className={className} />;
};

export default Image;
