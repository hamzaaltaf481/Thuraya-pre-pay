from PIL import Image

im = Image.open("browser.png")
im_resized = im.resize((600, 120))
im_resized.save("browser-600-resized.png", dpi=(600,120))
