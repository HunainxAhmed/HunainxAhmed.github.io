import os
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.print_page_options import PrintOptions

def generate_pdf():
    html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "cv_template.html"))
    output_pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "assets", "Hunain_Ahmed_CV.pdf"))
    dist_pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist", "assets", "Hunain_Ahmed_CV.pdf"))

    print(f"Loading HTML: {html_path}")
    print(f"Target PDF: {output_pdf_path}")

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--force-device-scale-factor=1")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        driver.get(f"file:///{html_path.replace(os.sep, '/')}")
        
        # Configure print options for flawless US Letter 1-page PDF
        print_options = PrintOptions()
        print_options.page_width = 8.5
        print_options.page_height = 11.0
        print_options.margin_top = 0.0
        print_options.margin_bottom = 0.0
        print_options.margin_left = 0.0
        print_options.margin_right = 0.0
        print_options.background = True
        print_options.shrink_to_fit = False

        pdf_base64 = driver.print_page(print_options)
        pdf_bytes = base64.b64decode(pdf_base64)

        os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
        with open(output_pdf_path, "wb") as f:
            f.write(pdf_bytes)
        print(f"Successfully generated PDF at {output_pdf_path} ({len(pdf_bytes)} bytes)")

        if os.path.exists(os.path.dirname(dist_pdf_path)):
            with open(dist_pdf_path, "wb") as f:
                f.write(pdf_bytes)
            print(f"Copied PDF to dist: {dist_pdf_path}")

    finally:
        driver.quit()

if __name__ == "__main__":
    generate_pdf()
