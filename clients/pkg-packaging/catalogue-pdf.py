# Builds the review PDF for Raffi from catalogue-draft.py
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import import_module
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether

C = import_module('catalogue-draft'.replace('-', '_')) if False else None
spec = __import__('importlib.util').util.spec_from_file_location('cd', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'catalogue-draft.py'))
cd = __import__('importlib.util').util.module_from_spec(spec); spec.loader.exec_module(cd)

OUT = sys.argv[1]
LOGO = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'brand-logo-square.png')
GREEN = colors.HexColor('#21642F'); BRIGHT = colors.HexColor('#52BE36'); INK = colors.HexColor('#121212')
MUTED = colors.HexColor('#5C5C5C'); SOFT = colors.HexColor('#EEF7EA'); LINE = colors.HexColor('#CFE5C6')
W = A4[0] - 32 * mm
h1 = ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=22, leading=26, textColor=INK)
sub = ParagraphStyle('s', fontName='Helvetica', fontSize=10.5, leading=15, textColor=MUTED)
h2 = ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=colors.white)
cell = ParagraphStyle('c', fontName='Helvetica', fontSize=8.8, leading=11.5, textColor=INK)
cellb = ParagraphStyle('cb', parent=cell, fontName='Helvetica-Bold')
small = ParagraphStyle('sm', fontName='Helvetica', fontSize=8.5, leading=11, textColor=MUTED)

def footer(c, d):
    c.saveState(); c.setFont('Helvetica', 8); c.setFillColor(MUTED)
    c.drawString(16 * mm, 9 * mm, 'PKG. Packaging Factory · Website product list (draft for review)')
    c.drawRightString(A4[0] - 16 * mm, 9 * mm, f'Page {d.page}')
    c.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=16 * mm, rightMargin=16 * mm, topMargin=14 * mm, bottomMargin=16 * mm,
                      title='PKG website product list (draft)', author='Website team')
doc.addPageTemplates([PageTemplate(frames=[Frame(16 * mm, 14 * mm, W, A4[1] - 28 * mm, id='f')], onPage=footer)])
s = []
head = Table([[Image(LOGO, 22 * mm, 22 * mm * 775 / 800),
               [Paragraph('Website product list', h1), Spacer(1, 3),
                Paragraph('Draft for review. We wrote this list for your website. Please tell us the numbers of anything you '
                          '<b>don\'t</b> make, and anything we should add. Sizes are examples, and minimum order shows as "on request".', sub)]]],
             colWidths=[28 * mm, W - 28 * mm])
head.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), ('LEFTPADDING', (0, 0), (-1, -1), 0)]))
s += [head, Spacer(1, 10)]
n = 0
for h, (title, items) in cd.C.items():
    bar = Table([[Paragraph(f'{title}  ·  {len(items)} products', h2)]], colWidths=[W])
    bar.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), GREEN), ('LEFTPADDING', (0, 0), (-1, -1), 8), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
    rows = [[Paragraph(x, cellb) for x in ['#', 'Product', 'Description', 'Material', 'Sizes']]]
    for name, desc, mat, sizes in items:
        n += 1
        rows.append([Paragraph(str(n), cellb), Paragraph(name, cellb), Paragraph(desc, cell), Paragraph(mat, cell), Paragraph(sizes, cell)])
    t = Table(rows, colWidths=[9 * mm, 36 * mm, W - 9 * mm - 36 * mm - 34 * mm - 30 * mm, 34 * mm, 30 * mm], repeatRows=1)
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('BACKGROUND', (0, 0), (-1, 0), SOFT),
                           ('LINEBELOW', (0, 0), (-1, -1), 0.4, LINE), ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4)]))
    s += [KeepTogether([bar, t]), Spacer(1, 10)]
s.append(Paragraph('<b>How to reply:</b> just send the numbers to remove (for example "remove 9, 23, 51") and anything to add. '
                   'Please also confirm: can we use the photos from your Instagram @pkg.packagingfactory on the website? '
                   'And send your showroom address, Google Maps pin and opening hours.', ParagraphStyle('r', parent=sub, textColor=INK)))
doc.build(s)
print('built', OUT, n, 'products')
