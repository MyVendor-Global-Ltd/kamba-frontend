import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/tokens';

const motifPaths = [
  'M-12 24 L24 -12 L60 24 L96 -12 L132 24 L168 -12 L204 24 L240 -12',
  'M-12 48 L24 12 L60 48 L96 12 L132 48 L168 12 L204 48 L240 12',
  'M-12 72 L24 36 L60 72 L96 36 L132 72 L168 36 L204 72 L240 36',
  'M-12 96 L24 60 L60 96 L96 60 L132 96 L168 60 L204 96 L240 60',
  'M-12 120 L24 84 L60 120 L96 84 L132 120 L168 84 L204 120 L240 84',
  'M-12 0 L24 36 L60 0 L96 36 L132 0 L168 36 L204 0 L240 36',
  'M-12 24 L24 60 L60 24 L96 60 L132 24 L168 60 L204 24 L240 60',
  'M-12 48 L24 84 L60 48 L96 84 L132 48 L168 84 L204 48 L240 84',
  'M-12 72 L24 108 L60 72 L96 108 L132 72 L168 108 L204 72 L240 108',
  'M-12 96 L24 132 L60 96 L96 132 L132 96 L168 132 L204 96 L240 132',
];

export const KambaTextileMotif = ({
  width = '100%',
  height = 144,
  color = colors.light.accent,
  opacity = 0.1,
  style,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 240 144"
    preserveAspectRatio="xMidYMid slice"
    accessible={false}
    pointerEvents="none"
    style={style}
  >
    {motifPaths.map((path, index) => (
      <Path
        key={index}
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={opacity}
      />
    ))}
  </Svg>
);

export default KambaTextileMotif;
