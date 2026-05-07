import cv2
import numpy as np

# Load image
img = cv2.imread('public/favicon_1.png', cv2.IMREAD_UNCHANGED)
if img is None:
    print("Could not read image")
    exit(1)

# Convert to RGBA if not already
if len(img.shape) == 2:
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
elif img.shape[2] == 3:
    img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

# Find foreground
# Assuming background is white or transparent
if img.shape[2] == 4:
    alpha = img[:, :, 3]
    rgb = img[:, :, :3]
    # Identify background as where alpha is 0 OR rgb is close to white
    is_white = np.all(rgb > 240, axis=-1)
    mask = (alpha > 10) & (~is_white)
else:
    is_white = np.all(img > 240, axis=-1)
    mask = ~is_white

# Find bounding box
coords = np.column_stack(np.where(mask))
if len(coords) == 0:
    print("No foreground found")
    exit(1)
y_min, x_min = coords.min(axis=0)
y_max, x_max = coords.max(axis=0)

# Crop to bounding box
cropped = img[y_min:y_max+1, x_min:x_max+1]
cropped_mask = mask[y_min:y_max+1, x_min:x_max+1]

# We want the logo to be white.
# So wherever cropped_mask is True, we set color to white.
logo_white = np.zeros_like(cropped)
logo_white[cropped_mask] = [255, 255, 255, 255]

# Now we want a black circular background.
# Let's create a black square image of size max(H, W) * 1.4 (to give some padding so logo doesn't touch the edge too much)
size = int(max(cropped.shape[0], cropped.shape[1]) * 1.5)
out = np.zeros((size, size, 4), dtype=np.uint8)

# Draw black circle
center = (size // 2, size // 2)
radius = size // 2
cv2.circle(out, center, radius, (0, 0, 0, 255), -1)

# Paste the white logo into the center
# Find center offsets
x_offset = (size - cropped.shape[1]) // 2
y_offset = (size - cropped.shape[0]) // 2

# Alpha blending the white logo onto the black circle
for y in range(cropped.shape[0]):
    for x in range(cropped.shape[1]):
        if cropped_mask[y, x]:
            out[y + y_offset, x + x_offset] = [255, 255, 255, 255]

# Resize to something standard like 512x512
out_resized = cv2.resize(out, (512, 512), interpolation=cv2.INTER_AREA)

cv2.imwrite('public/favicon.png', out_resized)
print("Saved public/favicon.png")
