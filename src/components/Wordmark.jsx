// Wordmark — the paw mark plus "VetMock", used by both navs.
//
// The mark lived only on the signed-out landing page; inside the product the
// brand was a bare text wordmark in the sidebar and the mobile header. Same
// mark, same file (/vetmock-logo.svg, 619 bytes), rendered small.
//
// It keeps its own sage/cream fills rather than theming — it reads as an app
// icon, and app icons don't invert with the interface around them.

export default function Wordmark({ size = 22 }) {
  return (
    <>
      <img
        src="/vetmock-logo.svg"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        style={{ borderRadius: size * 0.22, display: 'block', flexShrink: 0 }}
      />
      {/* No wrapper element around the text: `.vmx-logo span` styles the
          italic rose "Mock", and an extra span would match that selector
          first and tint the whole wordmark. */}
      Vet<span>Mock</span>
    </>
  );
}
