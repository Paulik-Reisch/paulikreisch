# Local fonts

These unmodified Latin WOFF2 files replace the build-time `next/font/google` downloads. Families, normal styles, weights, CSS variables and `font-display: swap` match the previous layout configuration.

Sources: the `@fontsource/poppins`, `@fontsource/inter`, `@fontsource/patrick-hand`, `@fontsource/lora` and `@fontsource/source-serif-4` npm packages (https://fontsource.org/). Each family includes its original license in this directory.

The files are committed so builds do not depend on Google Fonts availability or Turbopack's parsing of Google Fonts download URLs. Fontsource is not required as an installed application dependency.
