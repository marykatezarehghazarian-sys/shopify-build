import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Image,
                                Table, TableStyle, KeepTogether)
from PIL import Image as PILImage

D = sys.argv[1]
OUT = sys.argv[2]
PINK = colors.HexColor('#C7356C'); PLUM = colors.HexColor('#542634'); MUTED = colors.HexColor('#805563')
SOFT = colors.HexColor('#FFF0F4'); LINE = colors.HexColor('#F2BDCA'); GREEN = colors.HexColor('#2E7D4F'); AMBER = colors.HexColor('#B26A00')

title = ParagraphStyle('t', fontName='Helvetica-Bold', fontSize=24, leading=29, textColor=PINK)
sub = ParagraphStyle('s', fontName='Helvetica', fontSize=11, leading=15, textColor=MUTED)
h2 = ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=PLUM, spaceBefore=14, spaceAfter=6)
body = ParagraphStyle('b', fontName='Helvetica', fontSize=10, leading=14.5, textColor=PLUM)
small = ParagraphStyle('sm', fontName='Helvetica', fontSize=8.5, leading=11, textColor=MUTED)
cell = ParagraphStyle('c', parent=body, fontSize=9.5, leading=13)
cellb = ParagraphStyle('cb', parent=cell, fontName='Helvetica-Bold')

W = A4[0] - 36 * mm

def img(path, width=W):
    w, h = PILImage.open(path).size
    i = Image(path, width=width, height=width * h / w)
    t = Table([[i]], colWidths=[width])
    t.setStyle(TableStyle([('BOX', (0, 0), (-1, -1), 0.6, LINE), ('LEFTPADDING', (0, 0), (-1, -1), 0),
                           ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
    return t

def table(rows, widths, head=True):
    data = [[Paragraph(c, cellb if (head and r == 0) else cell) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    st = [('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), 0.4, LINE),
          ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]
    if head: st.append(('BACKGROUND', (0, 0), (-1, 0), SOFT))
    t.setStyle(TableStyle(st))
    return t

def footer(c, d):
    c.saveState(); c.setFont('Helvetica', 8); c.setFillColor(MUTED)
    c.drawString(18 * mm, 10 * mm, 'SBEA · sbeacosmetics.com · Website update, 16 November 2026')
    c.drawRightString(A4[0] - 18 * mm, 10 * mm, f'Page {d.page}')
    c.setStrokeColor(PINK); c.setLineWidth(2); c.line(18 * mm, A4[1] - 12 * mm, A4[0] - 18 * mm, A4[1] - 12 * mm)
    c.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm, bottomMargin=18 * mm,
                      title='SBEA website update', author='SBEA website team')
doc.addPageTemplates([PageTemplate(frames=[Frame(18 * mm, 16 * mm, W, A4[1] - 34 * mm, id='f')], onPage=footer)])

ok = '<font color="#2E7D4F"><b>Done</b></font>'
todo = '<font color="#B26A00"><b>Waiting</b></font>'
s = []
s += [Paragraph('SBEA website update', title), Spacer(1, 4),
      Paragraph('What we changed on sbeacosmetics.com, based on your requests. All changes are live and were checked on phone and computer.', sub), Spacer(1, 12)]

s.append(Paragraph('Summary', h2))
s.append(table([
    ['Request', 'Status', 'What we did'],
    ['Product sizes', ok, 'The size now shows under the name on every product page (e.g. Cheese Cake Scrub, 400 ml).'],
    ['Phone and email in contacts', ok, 'Contact page: Phone/WhatsApp +961 76 556 123 and ola.khalifeh@live.com, both tap to open.'],
    ['Instagram link', ok, 'Instagram @sbeacosmetics.lb on the Contact page and as an icon in the footer of every page.'],
    ['Hair care picture on the category card', ok, 'New photo with Gloss &amp; Glow serum and Silk &amp; Bloom oil, cropped so both bottles show in full.'],
    ['Category card links', ok, 'Hair care and Body care cards now open their own collections (before: all products).'],
    ['Site check', ok, 'Every page, product and link checked: no errors, broken links or broken images. Add to cart and checkout work.'],
    ['Return policy (damaged items only)', todo, 'Text is ready (see the end of this document). It needs to be pasted in Shopify: Settings → Policies → Refund policy.'],
], [44 * mm, 18 * mm, W - 62 * mm]))

s.append(Paragraph('1. Product sizes', h2))
s.append(Paragraph('Each product page now shows its size right under the product name. Sizes as you sent them:', body))
s.append(Spacer(1, 5))
s.append(table([
    ['Product', 'Size'],
    ['Body scrubs: Mix Berries, Oud and Amber, Flowery Vanilla, Bubble Gum', '150 ml'],
    ['Dry fruit scrubs: Green Tea and Lemon, Strawberry', '150 ml'],
    ['Cheese Cake Scrub', '400 ml'],
    ['Body butters (all 4 scents)', '150 ml'],
    ['Body lotions (all 4 scents)', '200 ml'],
    ['Body oils (all 4 scents)', '100 ml'],
    ['Silk and Bloom Hair Oil, Gloss and Glow Hair Serum', '100 ml'],
    ['Golden Kiss Shimmery Body Oil', '50 ml'],
], [W - 30 * mm, 30 * mm]))
s.append(Spacer(1, 4))
s.append(Paragraph('Hair mists and bundles were not on the list, so they show no size yet. Send their sizes and we will add them.', small))
s.append(Spacer(1, 8))
s.append(KeepTogether([img(f'{D}/product-crop.png', W * 0.85), Spacer(1, 3), Paragraph('Product page with the size under the name.', small)]))

s.append(Paragraph('2. Contact details and Instagram', h2))
s.append(Paragraph('The Contact page now lists the phone (opens WhatsApp), the email (opens the mail app) and Instagram. '
                   'The Instagram icon was also added to the footer of every page.', body))
s.append(Spacer(1, 8))
s.append(KeepTogether([img(f'{D}/contact-crop.png', W * 0.85), Spacer(1, 3), Paragraph('Contact page.', small), Spacer(1, 6),
                       img(f'{D}/footer.png', W * 0.85), Spacer(1, 3), Paragraph('Footer with the Instagram icon.', small)]))

s.append(Paragraph('3. Hair care card on the homepage', h2))
s.append(Paragraph('In the "Find your SBEA ritual" section, the Hair care card used to show a Bubble Gum body lotion on cotton candy. '
                   'It now shows your hair photo with the Gloss &amp; Glow serum and the Silk &amp; Bloom oil. '
                   'The card also opens the Hair Care collection now, and the Body care card opens Body Care. '
                   'A "Card photo" option was added, so the picture on any of these cards can be changed later in the theme editor.', body))
s.append(Spacer(1, 8))
s.append(KeepTogether([img(f'{D}/hair.png', W * 0.42), Spacer(1, 3), Paragraph('New Hair care card.', small)]))

s.append(Paragraph('4. Full site check', h2))
s.append(Paragraph('We checked all 31 products, every collection, the Contact page, cart, search and more than 200 internal links on a phone:', body))
s.append(Spacer(1, 4))
for t in ['No broken pages, links or images.',
          'No theme errors, and nothing spills off the side of the screen on phones.',
          'Add to cart and checkout work, with Cash on Delivery offered.',
          'The homepage had two main headings, which search engines don\'t like. Now it has one: "Own your natural glow."',
          'The only browser error comes from the Facebook ad pixel failing to reach Facebook\'s own server. It doesn\'t affect customers.']:
    s.append(Paragraph('• ' + t, body))

s.append(Paragraph('Still to do', h2))
s.append(table([
    ['Item', 'What is needed'],
    ['Refund policy', 'Paste the text below in Shopify: Settings → Policies → Refund policy → Save.'],
    ['Shipping and Terms policies', 'These pages don\'t exist yet (links show "page not found"). We can write them on request.'],
    ['Sizes for hair mists and bundles', 'Send the sizes if you want them shown.'],
], [52 * mm, W - 52 * mm]))
s.append(Spacer(1, 10))
box = Table([[Paragraph('<b>Suggested refund policy text</b><br/><br/>'
                        '<b>Returns &amp; refunds</b><br/>'
                        'We only accept returns if your item arrived damaged. Please contact us within 48 hours of delivery on WhatsApp '
                        '(+961 76 556 123) or at ola.khalifeh@live.com with your order number and a photo of the damaged item, '
                        'and we\'ll replace it or refund you. For hygiene reasons, we can\'t accept returns of opened or used products.', body)]],
            colWidths=[W])
box.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), SOFT), ('BOX', (0, 0), (-1, -1), 0.6, LINE),
                         ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                         ('TOPPADDING', (0, 0), (-1, -1), 10), ('BOTTOMPADDING', (0, 0), (-1, -1), 10)]))
s.append(box)
doc.build(s)
print('built', OUT)
