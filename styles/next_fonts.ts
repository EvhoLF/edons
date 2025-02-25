import clsx from 'clsx';
import { Montserrat, Montserrat_Alternates, Press_Start_2P } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
});

const montserrat_alt = Montserrat_Alternates({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat-alt',
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const pixel = Press_Start_2P({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-pixel',
  weight: ['400'],
});

const next_fonts = clsx(montserrat.variable, pixel.variable, montserrat_alt.variable);

export default next_fonts;