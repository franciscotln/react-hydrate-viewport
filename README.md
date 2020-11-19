# react-hydrate-viewport
Higher order React component for partial hydration on client side after SSR

## Installation
```bash
npm i react-hydrate-viewport
```

## Usage
This module uses the IntersectionObserver API so if you want to support older browsers make sure to provide an appropriate polyfill.

The following configuration properties can be set in the component:

### `lazy: boolean`
- default value: `true`
- description: sometimes you don't want a child component to be lazy hydrated, for example items which when rendered on the client will for sure be in the viewport or very close to the fold.

### `tagName: string`
- default value: `'div'`
- description: it's the type of the HTML element you want to render as the wrapper

### `rootMargin: string`
- default value: `'200px'`
- description: it's the value used for creating the [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)

Appart from the properties above, you can set any normal HTML property to the component, they will be passed to the wrapping element (default `div`), such as `onClick`, `data-*`, `className` etc.

## Examples

```js
import * as React from 'react';
import HydrateViewport from 'react-hydrate-viewport';

function ListItem(props) {
  return (
    <HydrateViewport
      tagName="article"
      lazy={props.lazy}
      className="item"
      data-role="list-item"
    >
      <h3>My awesome item</h3>
      <img src={props.thumbnail} alt="item thumbnail"></img>
    </HydrateViewport>
  );
}

function List(props) {
  return (
    <div className="items-list">
      {props.items.map((item, index) => (
        <ListItem
          {...item}
          key={item.id}
          lazy={index > props.hydrationThreshold}
        />
      ))}
    </div>
  );
}
```

The rendered markup would be:

```html
<div class="items-list">
  <article class="item" data-role="list-item">
    <h3>My awesome item</h3>
    <img src="some-source-link1" alt="item thumbnail">
  </article>
  <article class="item" data-role="list-item">
    <h3>My awesome item</h3>
    <img src="some-source-link2" alt="item thumbnail">
  </article>
  ...
</div>
```

When you take a look at React devtools for Chrome, the elements that are lazy hydrated (down below the fold) will appear without the `h3` and `img` elements, after scrolling you will notice that they mount (hydrate).


## Notes
This module is a simplification/modification of [react-lazy-hydration](https://github.com/hadeeb/react-lazy-hydration), tailored for one purpose: hydration of elements rendered via React's SSR that are about to come into the user's viewport.
