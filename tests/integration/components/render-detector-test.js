import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, setupOnerror } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | render-detector', function(hooks) {
  setupRenderingTest(hooks);

  test('it works', async function(assert) {
    this.set('parentText', 'parent');
    this.set('childText', 'child');

    let onRenderCount = 0;

    this.set('onRender', () => onRenderCount++);

    await render(hbs`
      <RenderDetector @onRender={{this.onRender}}>
        <Parent @text={{this.parentText}}>
          <Child @text={{this.childText}}/>
        </Parent>
      </RenderDetector>
    `);

    assert.equal(onRenderCount, 1, 'triggered once for initial render');

    this.setProperties({
      parentText: 'parent+',
      childText: 'child+',
    });

    assert.equal(onRenderCount, 2, 'triggered once for changing both properties');

    this.set('parentText', 'parent');

    assert.equal(onRenderCount, 3, 'triggered once for parent text changing');

    this.set('childText', 'child');

    assert.equal(onRenderCount, 4, 'triggered once for child text changing');
  });

  test('it asserts if used with incorrect arguments', async function(assert) {
    let errorCount = 0;

    setupOnerror(e => {
      errorCount++;
      assert.equal(e.message, 'Assertion Failed: <RenderDetector/> should receive exactly one argument, @onRender, which should be an action');
    });

    // Dummy function just for tests
    this.set('onRender', () => {});

    await render(hbs`<RenderDetector />`)
    assert.equal(errorCount, 1, 'errors when passed nothing');

    await render(hbs`<RenderDetector @onRender={{true}} />`);
    assert.equal(errorCount, 2, 'errors when passed a non-function');

    await render(hbs`<RenderDetector @onRender={{this.onRender}} @foo="bar"/>`);
    assert.equal(errorCount, 3, 'errors when passed too many arguments');
  });
});
