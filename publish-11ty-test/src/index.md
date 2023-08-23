---
title: Posts
layout: default.liquid
pagination:
  data: posts.data
  size: 100
  alias: posts
---

# Static Site (11ty)

<ul>
{%- for post in posts -%}
  <li><a href="/posts/{{ post.id }}/">{{ post.attributes.title }}</a></li>
{%- endfor -%}
</ul>
