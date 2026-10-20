# Local preview with the same Jekyll version and plugins GitHub Pages uses.
#   bundle install                      (once)
#   bundle exec jekyll serve --livereload   -> http://localhost:4000
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "webrick"          # required by `jekyll serve` on Ruby 3+

platforms :windows do
  gem "tzinfo-data"
  gem "wdm", ">= 0.1.0", require: false
end
