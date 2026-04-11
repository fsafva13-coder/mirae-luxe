import React from 'react';

function ProductImage({ src, alt, className, style }) {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError) {
      // Retry once after 500ms
      setTimeout(() => {
        setImgSrc(`${src}?retry=${Date.now()}`);
        setHasError(true);
      }, 500);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
    />
  );
}

export default ProductImage;