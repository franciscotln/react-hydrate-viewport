import { createElement, createRef, Component } from 'react';

export default class LazyHydrate extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.state = { hydrated: typeof document === 'undefined' };
  }

  componentDidMount() {
    const { lazy = true } = this.props;
    const hydrate = () => this.setState({ hydrated: true });
    if (this.ref.current.childElementCount) {
      if (lazy) {
        this.observer = new IntersectionObserver((entries, observerRef) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              hydrate();
              observerRef.disconnect();
            }
          });
        }, { rootMargin: this.props.rootMargin || '200px' });

        this.observer.observe(this.ref.current);
      }
    } else {
      hydrate();
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  render() {
    const { lazy = true, tagName = 'div', children, ...compProps } = this.props;

    return this.state.hydrated || !lazy
      ? createElement(tagName, { ...compProps, ref: this.ref }, children)
      : createElement(tagName, {
        ...compProps,
        ref: this.ref,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: '' },
      });
  }
}
