from PIL import Image
import os

# Parameters
input_image = 'Map.png'  # Replace with your input image file
output_directory = 'tiles'       # Output directory to store generated tiles
tile_size = 256                  # Size of each tile in pixels
max_zoom_level = 6              # Maximum zoom level

# Load the input image
image = Image.open(input_image)

# Ensure the image is in RGBA format (with alpha channel)
if image.mode != 'RGBA':
    image = image.convert('RGBA')

# Create the output directory if it doesn't exist
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# Calculate number of tiles at each zoom level
for zoom in range(max_zoom_level + 1):
    zoom_directory = os.path.join(output_directory, str(zoom))
    if not os.path.exists(zoom_directory):
        os.makedirs(zoom_directory)
    
    num_tiles = 2 ** zoom
    tile_width = image.width // num_tiles
    tile_height = image.height // num_tiles

    for x in range(num_tiles):
        for y in range(num_tiles):
            # Define the region to crop
            left = x * tile_width
            upper = y * tile_height
            right = min(left + tile_width, image.width)
            lower = min(upper + tile_height, image.height)
            
            # Crop the image to get the tile
            tile = image.crop((left, upper, right, lower))
            
            # Save the tile
            tile_filename = os.path.join(zoom_directory, f'{x}_{y}.png')
            tile.save(tile_filename)

print(f'Tiles generated successfully in "{output_directory}" directory.')