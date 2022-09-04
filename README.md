# React Mask Editor

A drop-in component to add simple image mask editing to your React application. Uses `<canvas>` for rendering & interaction, with optional support for customizing how the mask is displayed & edited.

[Online demo &amp; documentation](https://docs.voliere.dev/react-mask-editor)

#### Wait, what do you mean by "mask editor"?

You give React Mask Editor an image, and it lets the user 'scribble' over that image to create a 1-bit (black or white) mask. Think Photoshop, Lightroom, or Aperture.

![](/docs/example.png)

## Quick Start

First, some setup:

  * Add to your dependencies with `yarn install react-mask-editor`
  * Import with `import { MaskEditor, toMask } from "react-mask-editor";`
  * Include `node_modules/react-mask-editor/dist/style.css` somewhere in your bundle.

Usage:

```tsx
  const MyComponent: React.FC<{}> = () => {
    const canvas = React.useRef<HTMLCanvasElement>();

    return <>
      <MaskEditor
        src="https://placekitten/256/256"
        canvasRef={canvas}
      />
      <button
        onClick={() => console.log(toMask(canvas.current))}
      >
        Get Mask
      </button>
    </>
  }
```

You can customize the editor using additional, optional props:

<table class="bp4-html-table bp4-html-table-striped"><thead><tr><th>Prop</th><th>Description</th><th>Default</th></tr></thead><tbody><tr><td><code>cursorSize</code></td><td>Radius (in pixels) of the brush for editing the mask</td><td><code>10</code></td></tr><tr><td><code>onCursorSizeChange</code></td><td>Callback fired when the user changes the brush size via mousewheel. If not provided, mouse wheel events will be ignored.</td><td><code style="color: rgb(231, 106, 110);">undefined</code></td></tr><tr><td><code>maskOpacity</code></td><td>CSS opacity, decimal between 0 – 1</td><td><code>0.75</code></td></tr><tr><td><code>maskColor</code></td><td>A hex color (with or without leading '#').</td><td><code>#23272d</code></td></tr><tr><td><code>maskBlendMode</code></td><td>The <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/blend-mode">CSS blending mode</a> for the mask layer. Doesn't affect the output mask, just how it renders on top of your source image.</td><td><code>normal</code></td></tr></tbody></table>
