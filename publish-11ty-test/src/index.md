---
title: Articles
layout: default.liquid
pagination:
  data: articles.data
  size: 100
  alias: articles
---

# Static Site (11ty)

<ul>
{%- for article in articles -%}
  <li><a href="/articles/{{ article.id }}/">{{ article.attributes.title }}</a></li>
{%- endfor -%}
</ul>
