---
title: Article
layout: default.liquid
pagination:
  data: articles.data
  size: 1
  alias: article
permalink: 'articles/{{ article.id }}/'
---

<style>
  .body {
    border: 1px solid gray;
    padding: 10px;
  }
</style>

<p>
  Published Date: {{ article.attributes.publishedDate }}
</p>

<p>
  Tag: {{ article.attributes.tags.data[0].attributes.name }}
</p>

# {{ article.attributes.title }}

<p>
  Author: {{ article.attributes.createdBy.username }}
</p>

<img src="http://localhost:1337{{ article.attributes.featureImage.data.attributes.formats.large.url }}">

<div class="body">
  {{ article.attributes.body }}
</div>
