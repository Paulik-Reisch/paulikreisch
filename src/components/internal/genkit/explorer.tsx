'use client';

import 'json-formatter-js/dist/style.css';
import {GenkitDevUi} from 'genkit/dev-ui';
import {useEffect} from 'react';

export function GenkitExplorer() {
  useEffect(() => {
    // This is a workaround for a bug in json-formatter-js that causes
    // an error when rendering in a strict mode environment.
    const consoleError = console.error;
    const SUPPRESSED_WARNINGS = [
      'Warning: Using the `defaultValue` or `value` props on <input> without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.',
    ];
    console.error = function filterWarnings(msg, ...args) {
      if (
        !SUPPRESSED_WARNINGS.some((warning) =>
          typeof msg === 'string' ? msg.includes(warning) : false
        )
      ) {
        consoleError(msg, ...args);
      }
    };
    return () => {
      console.error = consoleError;
    };
  }, []);

  return (
    <div className="h-full w-full bg-white">
        <GenkitDevUi
            // By default, the Dev UI is configured to make API calls to the same
            // origin as the page is being served from.
            //
            // If the API is being served from a different origin, you can configure it here.
            // For example, if the API is being served from http://localhost:3400, you would
            // configure it like this:
            //
            // api={'http://localhost:3400/api/genkit'}
            //
            api={'/api/genkit'}
            //
            // By default, the Dev UI will use the path `/`. If you are mounting the Dev UI
            // at a different path, you can configure it here.
            //
            // For example, if you are mounting the Dev UI at `/tools/genkit`, you would
            // configure it like this:
            //
            // basePath={'/tools/genkit'}
        />
    </div>
  );
}
