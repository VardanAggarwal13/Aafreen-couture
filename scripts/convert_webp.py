import os
from PIL import Image

BRAIN_DIR = r"C:\Users\Vardan Aggarwal\.gemini\antigravity-ide\brain\2da946d2-f0f5-40c1-be61-d03209932fcd"
PUBLIC_IMG_DIR = r"c:\Users\Vardan Aggarwal\OneDrive\Desktop\Projects\afreen-project\public\images"

os.makedirs(os.path.join(PUBLIC_IMG_DIR, "products"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_IMG_DIR, "cats"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_IMG_DIR, "occasions"), exist_ok=True)

mapping = [
    ("hero_banner_webp_1786937079356.jpg", os.path.join(PUBLIC_IMG_DIR, "hero-banner.webp")),
    ("noor_e_ishq_product_1786934189576.jpg", os.path.join(PUBLIC_IMG_DIR, "products", "noor-e-ishq.webp")),
    ("noor_e_ishq_product_1786934189576.jpg", os.path.join(PUBLIC_IMG_DIR, "cats", "bridal.webp")),
    ("noor_e_ishq_product_1786934189576.jpg", os.path.join(PUBLIC_IMG_DIR, "cats", "lehenga.webp")),
    ("zarafshan_product_1786934660328.jpg", os.path.join(PUBLIC_IMG_DIR, "products", "zarafshan.webp")),
    ("zarafshan_product_1786934660328.jpg", os.path.join(PUBLIC_IMG_DIR, "cats", "bridesmaid.webp")),
    ("gulbahar_product_1786934736181.jpg", os.path.join(PUBLIC_IMG_DIR, "products", "gulbahar.webp")),
    ("gulbahar_product_1786934736181.jpg", os.path.join(PUBLIC_IMG_DIR, "cats", "suits.webp")),
    ("signature_coord_product_1786934773634.jpg", os.path.join(PUBLIC_IMG_DIR, "products", "signature-coord.webp")),
    ("signature_coord_product_1786934773634.jpg", os.path.join(PUBLIC_IMG_DIR, "cats", "coord.webp")),
    ("luxury_potli_bag_1786934807300.jpg", os.path.join(PUBLIC_IMG_DIR, "products", "luxury-potli.webp")),
    ("luxury_potli_bag_1786934807300.jpg", os.path.join(PUBLIC_IMG_DIR, "cats", "bags.webp")),
]

for src_name, dest_path in mapping:
    src_path = os.path.join(BRAIN_DIR, src_name)
    if os.path.exists(src_path):
        try:
            with Image.open(src_path) as img:
                img.save(dest_path, "WEBP", quality=95)
                print(f"Converted {src_name} -> {dest_path}")
        except Exception as e:
            print(f"Error converting {src_name}: {e}")
    else:
        print(f"Source file missing: {src_path}")
