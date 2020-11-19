import { Component, HTMLProps, RefObject } from 'react';

export interface LazyProps {
  tagName?: string;
  lazy?: boolean;
  rootMargin?: string;
}

export default class LazyHydrate extends Component<LazyProps & HTMLProps<any>> {
  public ref: RefObject<HTMLElement>
}
