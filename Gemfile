# frozen_string_literal: true

source "https://rubygems.org"

gem "rubocop", require: false
gem "rubocop-rails-omakase", require: false, group: [ :development ]

gem "jekyll"
gem "kramdown-parser-gfm"

group :jekyll_plugins do
  gem "jekyll-redirect-from"
  gem "jekyll-relative-links"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  # gem 'jekyll-paginate-v2'
  # gem 'jekyll-auto-authors'
end

gem "webrick"

# Fix for https://github.com/github/pages-gem/issues/399.
gem "dotenv"

gem "rb-inotify"

# Dig out bundled core deps as we prep to begin Ruby 3.4.0 support.
gem "csv"
gem "base64"
gem "bigdecimal"
