import React from 'react';

const withPositionOptimization = (WrappedComponent) => {
  return React.memo((props) => {
    // Убираем position из props, чтобы он не влиял на рендер
    const { position, ...restProps } = props;

    return <WrappedComponent {...restProps} />;
  }, (prevProps, nextProps) => {
    // Игнорируем изменения в position
    const prevWithoutPosition = { ...prevProps, position: null };
    const nextWithoutPosition = { ...nextProps, position: null };

    return JSON.stringify(prevWithoutPosition) === JSON.stringify(nextWithoutPosition);
  });
};

export default withPositionOptimization;