require 'sass-globbing'

sass_dir = "."

cache_path = "sass/.sass-cache"


# Just in case you build from here.
# Grunt will override this cause it's not in
# this directory.
css_dir = "../css"

# You will need this when working with sprites
# Adjust these won't hurt anybody
# 
# generated_images_dir = "../img"
images_dir = "../img"

# The environment variable is passed via grunt
output_style = (environment == :production) ? :compressed : :expanded
line_comments = true

relative_assets = true

# By default sass assets will have
# a timestamp added to the file name.
# If you send an expires header with your files
# you probably should use following statement
# 
# asset_cache_buster:none