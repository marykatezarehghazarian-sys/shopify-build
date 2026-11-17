# Draft PKG catalogue, written by us for Raffi to confirm (he asked us to "design and do everything").
# Run: python3 catalogue-draft.py  -> catalogue-draft.csv (import later) ; the PDF is built by catalogue-pdf.py
# Sizes are typical examples and minimum order is "on request" until Raffi confirms.
import csv, os

C = {}
def cat(handle, title, items):
    C[handle] = (title, items)

cat('food-takeaway', 'Food & Takeaway', [
    ('Burger Box', 'Sturdy clamshell box that keeps burgers hot and intact for dine-in and delivery, printed with your logo.', 'Kraft or white board', 'Small, medium, large'),
    ('Pizza Box', 'Corrugated pizza box with strong corners and your full-colour design on the lid.', 'Corrugated E-flute', '26, 30, 33, 40 cm'),
    ('Meal Box', 'Fold-and-lock box for platters, rice and grills, grease-resistant inside.', 'Kraft board with coating', 'Single and double portion'),
    ('Sandwich & Wrap Box', 'Window or closed box for sandwiches, wraps and toasties.', 'Kraft or white board', 'Standard sandwich, wrap, panini'),
    ('Shawarma & Sandwich Wrap Paper', 'Printed greaseproof wrap that holds sauces and shows your brand.', 'Greaseproof paper', 'Sheets or rolls, custom size'),
    ('Greaseproof Paper Sheets', 'Branded tray liners and food sheets for burgers, sweets and fried food.', 'Greaseproof paper', 'Custom size'),
    ('Fries Holder', 'Scoop-style fries holder, stable on the tray and easy to eat from.', 'Coated board', 'Small, medium, large'),
    ('Food Tray', 'Open paper tray for snacks, sides and street food.', 'Coated board', 'Several sizes'),
    ('Paper Bowl', 'Printed paper bowl for salads, noodles and hot food.', 'Coated paper board', '500 ml to 1300 ml'),
    ('Delivery Paper Bag', 'Strong paper bag for delivery orders with your logo and contact details.', 'Kraft paper', 'Small, medium, large'),
])
cat('bakery-pastry', 'Bakery & Pastry', [
    ('Cake Box', 'Cake box with or without a window, easy to fold and strong enough for heavy cakes.', 'White or kraft board', '20 to 35 cm, custom height'),
    ('Pastry Box', 'Box for croissants, pastries and mixed sweets, printed with your brand.', 'White or kraft board', 'Small, medium, large'),
    ('Cupcake Box', 'Cupcake box with insert that keeps each cupcake in place.', 'White board', '1, 2, 4, 6, 12 cups'),
    ('Chocolate & Sweets Box', 'Premium box for chocolates, maamoul and sweets, for daily sales and gifts.', 'Rigid or folding board', 'Custom'),
    ('Bûche de Noël Box', 'Long box for Christmas logs and roulades, seasonal design available.', 'White board', 'Custom length'),
    ('Cookie Box', 'Box or sleeve for cookies and biscuits, with or without window.', 'Folding board', 'Custom'),
    ('Bakery Paper Bag', 'Paper bag for bread, manakish and pastries.', 'Kraft or white paper', 'Several sizes'),
    ('Cake Board', 'Printed or plain board under cakes and tarts.', 'Thick board', 'Round or square, custom'),
])
cat('coffee-drinks', 'Coffee & Drinks', [
    ('Paper Cup', 'Branded paper cups for hot and cold drinks.', 'Single or double wall paper', '4, 8, 12, 16 oz'),
    ('Cup Sleeve', 'Heat sleeve with your logo, a cheap way to brand every cup.', 'Kraft or white board', 'Fits 8 to 16 oz'),
    ('Cup Carrier', 'Carrier for 2 or 4 drinks for takeaway and delivery.', 'Moulded pulp or board', '2 and 4 cups'),
    ('Printed Napkins', 'Napkins printed with your logo for cafés and restaurants.', 'Tissue paper', 'Cocktail, lunch, dinner'),
])
cat('paper-bags', 'Paper Bags', [
    ('Kraft Bag with Twisted Handle', 'Everyday shopping bag, strong and eco-looking.', 'Kraft paper', 'Small to extra large'),
    ('White Paper Bag', 'Clean white bag for pharmacies, boutiques and food.', 'White paper', 'Small to large'),
    ('Luxury Rope Bag', 'Premium laminated bag with rope or ribbon handles for boutiques and gifts.', 'Art board, laminated', 'Custom'),
    ('Flat Handle Bag', 'Paper bag with flat paper handles, ideal for food and takeaway.', 'Kraft or white paper', 'Several sizes'),
    ('Gift Bag', 'Printed gift bag for events, corporate gifts and seasons.', 'Art board or kraft', 'Custom'),
])
cat('labels-stickers', 'Labels & Stickers', [
    ('Logo Stickers', 'Round or shaped stickers to brand bags, boxes and cups.', 'Paper or vinyl', 'Custom shape and size'),
    ('Product Labels', 'Labels for jars, bottles and packs with ingredients and branding.', 'Paper, vinyl or transparent', 'Custom'),
    ('Box Seal Stickers', 'Seals that close boxes and bags neatly and show your brand.', 'Paper or vinyl', 'Custom'),
    ('Price & Barcode Labels', 'Plain or printed labels for pricing and barcodes.', 'Paper', 'Custom'),
])
cat('retail-clothing', 'Retail & Product Packaging', [
    ('Mailer Box', 'Printed mailer box for online orders and subscription boxes.', 'Corrugated', 'Custom'),
    ('Product Box', 'Folding box for cosmetics, food products and accessories.', 'Folding board', 'Custom'),
    ('Rigid Gift Box', 'Premium rigid box with lid or magnetic closure.', 'Rigid board wrapped in printed paper', 'Custom'),
    ('Packaging Sleeve', 'Printed sleeve that wraps around a box or product.', 'Folding board', 'Custom'),
    ('Hang Tags', 'Clothing and product tags with string or hole.', 'Thick card', 'Custom'),
    ('Printed Tissue Paper', 'Tissue paper with your logo for wrapping clothes and gifts.', 'Tissue paper', 'Standard sheets'),
    ('Counter Display Stand', 'Cardboard display for shops and launches.', 'Corrugated or board', 'Custom'),
    ('Thank-You Cards', 'Small cards to add to orders.', 'Card', 'A6, custom'),
])
cat('corporate-print', 'Corporate Print', [
    ('Business Cards', 'Business cards in many finishes.', 'Card, laminated options', 'Standard 9 x 5 cm'),
    ('Letterheads', 'Branded letterhead paper.', 'Offset paper', 'A4'),
    ('Envelopes', 'Printed envelopes for letters and invitations.', 'Paper', 'DL, C5, C4'),
    ('Presentation Folders', 'Folders with pockets for proposals and documents.', 'Card', 'A4'),
    ('Flyers & Brochures', 'Flyers and folded brochures for promotions.', 'Art paper', 'A5, A4, folded'),
    ('Catalogues', 'Product catalogues and company profiles, stapled or bound.', 'Art paper', 'A4, A5, custom'),
    ('Branded Notebooks', 'Notebooks with your logo for teams and events.', 'Paper with printed cover', 'A5, A6'),
    ('Calendars', 'Wall and desk calendars with your branding.', 'Paper and card', 'Custom'),
])
cat('school-print', 'School Print', [
    ('Exercise Books & Notebooks', 'Notebooks with the school logo and colours.', 'Paper with printed cover', 'A5, A4'),
    ('Certificates & Diplomas', 'Printed certificates for graduations and events.', 'Premium card', 'A4'),
    ('Report Folders', 'Folders for reports and school documents.', 'Card', 'A4'),
    ('Agendas & Planners', 'School diaries and planners for the year.', 'Paper with printed cover', 'A5'),
])
cat('events-weddings', 'Events & Weddings (new)', [
    ('Invitations', 'Wedding, engagement and event invitations.', 'Premium card, special finishes', 'Custom'),
    ('Invitation Envelopes', 'Matching envelopes for invitations.', 'Paper', 'Custom'),
    ('Event Programs & Menus', 'Printed programs and menu cards for events.', 'Card', 'Custom'),
    ('Favour Boxes', 'Small boxes for chocolates and favours.', 'Folding or rigid board', 'Custom'),
    ('Event Gift Bags & Tags', 'Gift bags and tags for guests.', 'Paper and card', 'Custom'),
])

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(here, 'catalogue-draft.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['category_handle', 'category', 'name', 'description', 'material', 'sizes', 'minimum_order'])
        for h, (t, items) in C.items():
            for n, d, m, s in items: w.writerow([h, t, n, d, m, s, 'On request'])
    print(sum(len(i) for _, i in C.values()), 'products in', len(C), 'categories')
