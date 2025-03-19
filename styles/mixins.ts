import { palette } from "./variables"

export const gradientText = {
  background: palette.gradientPrimary,
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  opacity: '1',
  overflow: 'hidden',
}

export const gradientSvg = {
  svg: {
    // fill: colors.primary.main,
    fill: 'url(#gradient)',
  }
}

export const gradientBorder = {
  borderColor: 'transparent !important',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    border: '2px solid transparent',
    borderRadius: 'inherit',
    background: palette.gradientPrimary,
    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  }
}

export const glassBackground = {
  borderRadius: '8px',
  border: `1px solid ${palette.glass.border}`,
  background: '#fff',
  WebkitBackdropFilter: 'saturate(180%) blur(4px)',
  backdropFilter: 'saturate(180%) blur(4px)',
}