/**
 * @fileoverview This file initializes the Genkit AI singleton.
 *
 * It is important that this file is imported before any other Genkit-related
 * code is executed, as it sets up the necessary plugins.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
});
