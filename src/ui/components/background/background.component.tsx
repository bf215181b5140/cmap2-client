import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import { BackgroundDTO } from 'cmap2-shared';

const Background = styled.div<{ background: BackgroundDTO; }>`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  // background style
  ${props => backgroundStyles[props.background.id]};
`;

export default Background;

const backgroundStyles: {[key: string]: FlattenInterpolation<ThemeProps<DefaultTheme>>} = {};

backgroundStyles.ocean = css`
  background-color: #005281;
  background-image: linear-gradient(160deg, #005281 0%, #4b7c77 100%);
`;

backgroundStyles.obsidian = css`
  background-color: #3b5269;
  background-image: linear-gradient(62deg, #62556e 0%, #3b5269 100%);
`;

backgroundStyles.secret = css`
  background-color: #367065;
  background-image: linear-gradient(90deg, #367065 0%, #646c91 100%);
`;

backgroundStyles.sunflower = css`
  background-color: #b0962f;
  background-image: linear-gradient(132deg, #b0962f 0%, #127a66 100%);
`;

backgroundStyles.sofa = css`
  background-color: #ab7674;
  background-image: linear-gradient(19deg, #ab7674 0%, #a19bb4 100%);
`;

backgroundStyles.distance = css`
  background-color: #28a9a9;
  background-image: linear-gradient(109.6deg, #28a9a9 11.2%, #330867 92.5%);
`;

backgroundStyles.sunrise = css`
  background-color: #3266a2;
  background-image: linear-gradient(43deg, #3266a2 0%, #8f478b 46%, #cca258 100%);
`;

backgroundStyles.mystic = css`
  background-color: #1b7e98;
  background-image: linear-gradient(45deg, #a05aa2 0%, #1b7e98 52%, #1e9652 90%);
`;

backgroundStyles.darkSpring = css`
  background-color: #0C6C75;
  background-image: radial-gradient(circle farthest-corner at 10% 20%, #0C8D47 0%, #0C6C75 90%);
`;

backgroundStyles.swift = css`
  --s: 50px;
  --c: #191e22;
  --_s: calc(2 * var(--s)) calc(2 * var(--s));
  --_g: 35.36% 35.36% at;
  --_c: #0000 66%, #20262a 68% 70%, #0000 72%;
  background: radial-gradient(var(--_g) 100% 25%, var(--_c)) var(--s) var(--s)/var(--_s),
  radial-gradient(var(--_g) 0 75%, var(--_c)) var(--s) var(--s)/var(--_s),
  radial-gradient(var(--_g) 100% 25%, var(--_c)) 0 0/var(--_s),
  radial-gradient(var(--_g) 0 75%, var(--_c)) 0 0/var(--_s),
  repeating-conic-gradient(var(--c) 0 25%, #0000 0 50%) 0 0/var(--_s),
  radial-gradient(var(--_c)) 0 calc(var(--s) / 2)/var(--s) var(--s) var(--c);
  background-attachment: fixed;
`;

backgroundStyles.jagg = css`
  --r: 50px; /* control the size */
  --c1: #0a252a /*color 1*/ 99%, #0000 101%;
  --c2: #0A1118 /*color 2*/ 99%, #0000 101%;
  --s: calc(var(--r) * .866); /* .866 = cos(30deg) */
  --g0: radial-gradient(var(--r), var(--c1));
  --g1: radial-gradient(var(--r), var(--c2));
  --f: radial-gradient(var(--r) at calc(100% + var(--s)) 50%, var(--c1));
  --p: radial-gradient(var(--r) at 100% 50%, var(--c2));
  background: var(--f) 0 calc(-5 * var(--r) / 2),
  var(--f) calc(-2 * var(--s)) calc(var(--r) / 2),
  var(--p) 0 calc(-2 * var(--r)),
  var(--g0) var(--s) calc(-5 * var(--r) / 2),
  var(--g1) var(--s) calc(5 * var(--r) / 2),
  radial-gradient(var(--r) at 100% 100%, var(--c1)) 0 calc(-1 * var(--r)),
  radial-gradient(var(--r) at 0% 50%, var(--c1)) 0 calc(-4 * var(--r)),
  var(--g1) calc(-1 * var(--s)) calc(-7 * var(--r) / 2),
  var(--g0) calc(-1 * var(--s)) calc(-5 * var(--r) / 2),
  var(--p) calc(-2 * var(--s)) var(--r),
  var(--g0) calc(-1 * var(--s)) calc(var(--r) / 2),
  var(--g1) calc(-1 * var(--s)) calc(var(--r) / -2),
  var(--g0) 0 calc(-1 * var(--r)),
  var(--g1) var(--s) calc(var(--r) / -2),
  var(--g0) var(--s) calc(var(--r) / 2) #0A1118; /*color 2 again here */
  background-size: calc(4 * var(--s)) calc(6 * var(--r));
`;

backgroundStyles.square = css`
  --s: 130px; /* control the size */
  --_g: #0000 90deg, #1d2123 0;
  background: conic-gradient(from 116.56deg at calc(100% / 3) 0, var(--_g)),
  conic-gradient(from -63.44deg at calc(200% / 3) 100%, var(--_g)) #2e353b;
  background-size: var(--s) var(--s);
`;

