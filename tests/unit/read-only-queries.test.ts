import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

test('Firestore getters cannot seed or mutate production collections during render/build', () => {
  const file = ts.createSourceFile('firestore.ts', readFileSync('src/lib/firestore.ts', 'utf8'), ts.ScriptTarget.Latest, true);
  const forbidden = /^(setDoc|addDoc|updateDoc|deleteDoc|writeBatch|initializeArticles|initializeLandingPages|initializeExcerpts)$/;
  for (const node of file.statements) {
    if (!ts.isFunctionDeclaration(node) || !node.name?.text.startsWith('get') || !node.body) continue;
    const inspect = (child: ts.Node) => {
      if (ts.isCallExpression(child) && ts.isIdentifier(child.expression)) {
        assert.ok(!forbidden.test(child.expression.text), `${node.name?.text} calls ${child.expression.text}`);
      }
      ts.forEachChild(child, inspect);
    };
    inspect(node.body);
  }
});
