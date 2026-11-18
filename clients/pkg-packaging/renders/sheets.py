# contact sheets of renders in catalogue order: python renders/sheets.py <outdir> [per_sheet]
import csv, re, sys, os
from PIL import Image, ImageDraw, ImageFont
here = os.path.dirname(os.path.abspath(__file__)); out = sys.argv[1]; per = int(sys.argv[2]) if len(sys.argv) > 2 else 12
slug = lambda s: re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', 'and')))
names = [r['name'] for r in csv.DictReader(open(os.path.join(here, '..', 'catalogue-draft.csv')))]
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20); T = 450; C = 4
for s in range(0, len(names), per):
    grp = names[s:s + per]; rows = (len(grp) + C - 1) // C; sh = Image.new('RGB', (C * T, rows * (T + 34)), 'white'); d = ImageDraw.Draw(sh)
    for i, n in enumerate(grp):
        x, y = (i % C) * T, (i // C) * (T + 34); im = Image.open(os.path.join(here, 'out', slug(n) + '.jpg')).resize((T - 10, T - 10))
        sh.paste(im, (x + 5, y + 5)); d.text((x + 8, y + T - 2), f'{s + i + 1}. {n}', fill='black', font=f)
    sh.save(os.path.join(out, f'renders-{s // per + 1}.jpg'), quality=85); print('sheet', s // per + 1)
