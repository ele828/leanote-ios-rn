var safeHtml = require('./safe-html');
var expect = require('expect.js');
var _ = require('underscore');

describe('safe-html', function () {
  it('should strip tags not in the allowed list', function () {
    expect(safeHtml("<crazyTag>Hello <b>World</b></crazyTag>")).to.equal("Hello <b>World</b>");
  });

  it('should drop contents of script tags (default config)', function () {
    expect(safeHtml("<div>Hello <script>alert('boom!')</script>World</div>")).to.equal("<div>Hello World</div>");
  });

  it('should not allow attributes not explicitely allowed for tags', function () {
    expect(safeHtml("<div dostuff='hello'>Hello World</div>")).to.equal("<div>Hello World</div>");
  });

  it('should HTML encode text', function () {
    expect(safeHtml("<i>Hello & \"World\"</i>")).to.equal("<i>Hello &amp; &quot;World&quot;</i>");
  });

  it('should HTML encode attribute values', function () {
    expect(
      safeHtml(
        '<div my-attribute="my&class">Hello World</div>',
        {allowedAttributes: {'my-attribute': {allTags: true}}}),
      '<div my-attribute="my&amp;class">Hello World</div>');
  });

  it('should normalise the syntax for attributes', function () {
    expect(
      safeHtml(
        "<div a=hello b='world' c d=\"\">Hello World</div>",
        {allowedAttributes: {a: {allTags: true}, b: {allTags: true}}}),
      '<div a="hello" b="world" c d="">Hello World</div>');
  });

  it('should not allow through other stuff inside tags', function () {
    expect(
      safeHtml(
        "<div < = '>Hello World</div>"),
      '<div>Hello World</div>');
  });

  it('should only allow http, mailto and tel links (default config)', function () {
    expect(
      safeHtml(
        '<a href="javascript:alert("Bam!")">Hello World</a>' +
        '<a href="/relative/url">Hello World</a>' +
        '<a href="http://example.com">Hello World</a>' +
        '<a href="https://example.com">Hello World</a>' +
        '<a href="mailto:test@example.com">Hello World</a>' +
        '<a href="tel:123">Hello World</a>'))
    .to.equal(
      '<a>Hello World</a>' +
      '<a>Hello World</a>' +
      '<a href="http://example.com">Hello World</a>' +
      '<a href="https://example.com">Hello World</a>' +
      '<a href="mailto:test@example.com">Hello World</a>' +
      '<a href="tel:123">Hello World</a>'
    );
  });
});
