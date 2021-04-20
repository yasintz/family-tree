import React from 'react';

//--------------------
import nodes from './nodes';

//--------------------

const icons = {
  nodes,
} as const;

type IconProps = {
  name: keyof typeof icons;
  onClick?: () => void;
  className?: string;
  size?: number;
  color?: string;
};

const Icon: React.FC<IconProps> = ({
  name,
  className,
  onClick,
  size = 16,
  color,
}) => {
  const _Icon = icons[name];
  return (
    <_Icon
      onClick={onClick}
      className={className}
      width={size}
      height={size}
      fill={color}
    />
  );
};

export default Icon;
