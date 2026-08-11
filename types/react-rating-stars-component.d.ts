declare module 'react-rating-stars-component' {
  import { ComponentType } from 'react';

  interface ReactStarsProps {
    count?: number;
    value?: number;
    size?: number;
    isHalf?: boolean;
    edit?: boolean;
    activeColor?: string;
    color?: string;
    onChange?: (newRating: number) => void;
    a11y?: boolean;
    emptyIcon?: JSX.Element;
    halfIcon?: JSX.Element;
    fullIcon?: JSX.Element;
    className?: string;
  }

  const ReactStars: ComponentType<ReactStarsProps>;
  export default ReactStars;
}
