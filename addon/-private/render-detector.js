import { DEBUG } from '@glimmer/env';
import { assert } from '@ember/debug';
import { capabilities, setComponentManager } from '@ember/component';

class RenderDetectorManager {
  constructor() {
    this.capabilities = capabilities('3.13', {
      asyncLifecycleCallbacks: true,
      updateHook: true,
    });
  }

  createComponent(_class, args) {
    return args;
  }

  didCreateComponent(args) {
    assert(
      '<RenderDetector/> should receive exactly one argument, @onRender, which should be an action',
      args.positional.length === 0 &&
        Object.keys(args.named).length === 1 &&
        typeof args.named.onRender === 'function'
    );

    args.named.onRender();
  }

  updateComponent() {}

  didUpdateComponent(args) {
    assert(
      '<RenderDetector/> should receive exactly one argument, @onRender, which should be an action',
      args.positional.length === 0 &&
        Object.keys(args.named).length === 1 &&
        typeof args.named.onRender === 'function'
    );

    args.named.onRender();
  }

  getContext(args) {
    return args;
  }
}

const RENDER_DETECTOR_COMPONENT = {};

if (DEBUG) {
  Object.freeze(RENDER_DETECTOR_COMPONENT);
}

setComponentManager(
  () => new RenderDetectorManager(),
  RENDER_DETECTOR_COMPONENT
);

export default RENDER_DETECTOR_COMPONENT;
