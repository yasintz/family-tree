import React from 'react';
import * as FIcon from 'react-feather';
import { IconProps } from 'react-feather';

type IconComponentProps = {
  name: keyof typeof FIcon;
} & IconProps;

const Icon: React.FC<IconComponentProps> = ({ name, size = 16, ...props }) => {
  const _Icon = FIcon[name];
  return <_Icon size={size} {...props} />;
};

export default Icon;
