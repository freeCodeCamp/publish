---
title: Post
layout: default.liquid
pagination:
  data: posts.data
  size: 1
  alias: post
permalink: 'posts/{{ post.id }}/'
---

<style>
  .body {
    border: 1px solid gray;
    padding: 10px;
  }
</style>

<p>
  Published Date: {{ post.attributes.publishedDate }}
</p>

<p>
  Tag: {{ post.attributes.tags.data[0].attributes.name }}
</p>

# {{ post.attributes.title }}

<p>
  Author: {{ post.attributes.createdBy.username }}
</p>

<img src="http://localhost:1337{{ post.attributes.featureImage.data.attributes.formats.large.url }}">

<div class="body">
  {{ post.attributes.body }}
</div>
