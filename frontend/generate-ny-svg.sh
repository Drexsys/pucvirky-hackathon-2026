npm i -g mapshaper

curl -L "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/new-york-counties.geojson" -o ny-counties.geojson

# dissolve all counties into a single state outline + simplify for UI
mapshaper ny-counties.geojson \
  -dissolve \
  -simplify 4% keep-shapes \
  -o format=svg ny-outline.svg