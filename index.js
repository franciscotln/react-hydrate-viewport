import { createElement, createRef, Component } from 'react';

export default class LazyHydrate extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.state = { hydrated: typeof document === 'undefined' };
  }

  componentDidMount() {
    this.observer = new IntersectionObserver((entries, observerRef) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          this.setState({ hydrated: true });
          observerRef.unobserve(entry.target);
        }
      });
    }, { rootMargin: this.props.rootMargin || '200px' });

    this.observer.observe(this.ref.current);
  }

  componentWillUnmount() {
    this.observer.unobserve(this.ref.current);
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
