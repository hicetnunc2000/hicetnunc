# Layout

The layout of each page should inherit from these building blocks

## Page

A `<Page />` component should be the parent element of each page. Its role is to add a min-height and padding on top and bottom

## Container

A `<Container />` component's role is to define media queries and spacing between all different containers.

An Example:

```jsx
const Example = () => (
  <Page>
    <Container>This is a container</Container>
    <Container>This is another container</Container>
  </Page>
)
```

## Padding

A `<Padding />` component is reponsible to add paddings based on different media queries.

```jsx
const Example = () => (
  <Page>
    <Container>
      <Padding>This is a container with padding</Container>
    </Padding>
    <Padding>
      <Container>This is another container with padding</Container>
    </Padding>
  </Page>
)
```
