"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fromPairs = require("lodash.frompairs");
const ngcomponent_1 = require("ngcomponent");
const React = require("react");
const client_1 = require("react-dom/client");
/**
 * Wraps a React component in Angular. Returns a new Angular component.
 *
 * Usage:
 *
 *   ```ts
 *   type Props = { foo: number }
 *   class ReactComponent extends React.Component<Props, S> {}
 *   const AngularComponent = react2angular(ReactComponent, ['foo'])
 *   ```
 */
function react2angular(ReactComponent, bindingNames = null, injectNames = []) {
    const names = bindingNames
        || (ReactComponent.propTypes && Object.keys(ReactComponent.propTypes))
        || [];
    return {
        bindings: fromPairs(names.map(_ => [_, '<'])),
        controller: ['$element', ...injectNames, class extends ngcomponent_1.default {
                constructor($element, ...injectedProps) {
                    super();
                    this.$element = $element;
                    this.isDestroyed = false;
                    this.injectedProps = {};
                    injectNames.forEach((name, i) => {
                        this.injectedProps[name] = injectedProps[i];
                    });
                    this.root = client_1.createRoot($element[0]);
                }
                static get $$ngIsClass() {
                    return true;
                }
                $onInit() {
                    names.forEach((name) => {
                        this.props[name] = this[name];
                    });
                }
                render() {
                    if (!this.isDestroyed) {
                        this.root.render(React.createElement(ReactComponent, Object.assign({}, this.props, this.injectedProps)));
                    }
                }
                componentWillUnmount() {
                    this.isDestroyed = true;
                    if (this.$element[0] && this.root) {
                        this.root.unmount();
                    }
                }
            }]
    };
}
exports.react2angular = react2angular;
//# sourceMappingURL=index.js.map