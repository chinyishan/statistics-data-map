import { filename } from 'pathe/utils';

export const useGlobImg = () => {
  //eager 在編譯時就執行此動態
  const globJpg = import.meta.glob('~/assets/picture/*.jpg', {
    eager: true,
  });
  const globPng = import.meta.glob('~/assets/picture/*.png', {
    eager: true,
  });
  const globSvg = import.meta.glob('~/assets/icon/*.svg', {
    eager: true,
  });

  const imagesJpg = Object.fromEntries(
    Object.entries(globJpg).map(([key, value]) => [
      filename(key),
      value.default,
    ])
  );
  const imagesPng = Object.fromEntries(
    Object.entries(globPng).map(([key, value]) => [
      filename(key),
      value.default,
    ])
  );
  const imagesSvg = Object.fromEntries(
    Object.entries(globSvg).map(([key, value]) => [
      filename(key),
      value.default,
    ])
  );

  return {
    globJpg,
    globPng,
    globSvg,
    imagesJpg,
    imagesPng,
    imagesSvg,
  };
};
