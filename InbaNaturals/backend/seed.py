from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.product import Product
from app.utils.security import get_password_hash


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Admin user
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@inbanaturals.com",
            password_hash=get_password_hash("admin123"),
            full_name="Admin",
            role="admin",
            wallet_balance=0,
            is_verified=True,
        )
        db.add(admin)

    # Demo user
    demo = db.query(User).filter(User.username == "demo").first()
    if not demo:
        demo = User(
            username="demo",
            email="demo@inbanaturals.com",
            password_hash=get_password_hash("demo123"),
            full_name="Demo User",
            role="user",
            wallet_balance=5000,
            is_verified=True,
        )
        db.add(demo)

    # Products
    products_data = [
        {
            "name": "Abha Herbal Hair Oil",
            "slug": "hair-oil",
            "tagline": "Indian Gooseberry & Kunthala Blend — Luxe & Vibrant",
            "description": "Inspired by ancient Ayurvedic traditions, Abha Herbal Hair Oil is a premium botanical blend infused with Indian Gooseberry (Amla) and the revitalising Kunthala herb complex. Cold-pressed in small batches with coconut, argan, and castor oils, it penetrates deep into the scalp to strengthen roots, reduce hair fall, and restore natural lustre.",
            "price": 499,
            "original_price": 699,
            "category": "hair",
            "sizes": '["100ml", "200ml"]',
            "ingredients": "Cocos Nucifera (Coconut) Oil, Phyllanthus Emblica (Indian Gooseberry / Amla) Extract, Argania Spinosa (Argan) Kernel Oil, Ricinus Communis (Castor) Seed Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract, Eclipta Prostrata (Bhringraj) Extract, Vitamin E Tocopherol, Lavandula Angustifolia (Lavender) Essential Oil.",
            "how_to_use": "Warm 5-6 drops between your palms and massage gently into the scalp in circular motions. Leave on for at least 30 minutes or overnight. Wash off with a mild sulphate-free shampoo. Use 2-3 times a week.",
            "image_url": "/assets/images/products/hair-oil-main.jpg",
            "in_stock": True,
            "stock_quantity": 50,
            "is_featured": True,
        },
        {
            "name": "Clear Scalp Anti-Dandruff Hair Pack",
            "slug": "hair-pack",
            "tagline": "Deep-cleansing herbal mask for a flake-free, healthy scalp",
            "description": "The Clear Scalp Anti-Dandruff Hair Pack is a potent herbal treatment formulated with fenugreek seed powder, neem leaf extract, and natural clays to gently exfoliate the scalp, control excess oil, and eliminate dandruff at its root. Suitable for all hair types.",
            "price": 399,
            "original_price": 549,
            "category": "hair",
            "sizes": '["100g", "200g"]',
            "ingredients": "Trigonella Foenum-Graecum (Fenugreek / Methi) Seed Powder, Azadirachta Indica (Neem) Leaf Extract, Kaolin Clay, Aloe Barbadensis Leaf Juice, Melaleuca Alternifolia (Tea Tree) Oil, Butyrospermum Parkii (Shea) Butter, Hydrolyzed Keratin, Panthenol (Pro-Vitamin B5).",
            "how_to_use": "Mix 2-3 tablespoons with curd or water to form a smooth paste. Apply generously to damp scalp and hair. Leave on for 20-30 minutes. Rinse thoroughly with lukewarm water. Use once a week.",
            "image_url": "/assets/images/products/hair-pack-main.jpg",
            "in_stock": True,
            "stock_quantity": 30,
            "is_featured": True,
        },
        {
            "name": "Vitamin C Glow Face Pack",
            "slug": "face-pack",
            "tagline": "Brightening clay mask for radiant, lit-from-within skin",
            "description": "Our Vitamin C Glow Face Pack harnesses the brightening power of stable Vitamin C, turmeric root, and natural clay to deliver a visible glow in just 4 weeks of regular use. Gently draws out impurities, fades dark spots, and evens skin tone.",
            "price": 349,
            "original_price": 499,
            "category": "face",
            "sizes": '["50g", "100g"]',
            "ingredients": "Ascorbic Acid (Vitamin C), Kaolin Clay, Multani Mitti, Curcuma Longa (Turmeric) Root Powder, Citrus Limon (Lemon) Peel Extract, Zingiber Officinale (Ginger) Root Extract, Santalum Album (Sandalwood) Powder, Citrus Sinensis (Orange Peel) Powder.",
            "how_to_use": "Mix 1-2 teaspoons with rose water or plain water. Apply evenly to cleansed face. Leave for 15-20 minutes until partially dry. Rinse off with lukewarm water. Use 2-3 times a week.",
            "image_url": "/assets/images/products/face-pack-main.jpg",
            "in_stock": True,
            "stock_quantity": 40,
            "is_featured": True,
        },
        {
            "name": "Botanical Radiance Face Serum",
            "slug": "face-serum",
            "tagline": "Multi-oil elixir with plant actives for youthful, dewy skin",
            "description": "The Botanical Radiance Face Serum is a lightweight, fast-absorbing elixir housed in amber glass to preserve potency. Formulated with cold-pressed rosehip seed oil, hyaluronic acid, niacinamide, and centella asiatica extract for deep hydration and collagen boost.",
            "price": 599,
            "original_price": 799,
            "category": "face",
            "sizes": '["15ml", "30ml"]',
            "ingredients": "Aqua, Ascorbic Acid (Vitamin C), Sodium Hyaluronate, Niacinamide, Glycerin, Centella Asiatica Extract, Rosa Canina (Rosehip) Seed Oil, Squalane, Allantoin, Tocopherol (Vitamin E), Citric Acid.",
            "how_to_use": "After cleansing and toning, dispense 3-4 drops onto your fingertips. Gently press and pat into face and neck. Follow with moisturiser or SPF. Use morning and evening.",
            "image_url": "/assets/images/products/face-serum-main.jpg",
            "in_stock": True,
            "stock_quantity": 35,
            "is_featured": True,
        },
    ]

    for data in products_data:
        existing = db.query(Product).filter(Product.slug == data["slug"]).first()
        if not existing:
            db.add(Product(**data))

    db.commit()
    db.close()
    print("Seed data inserted successfully")


if __name__ == "__main__":
    seed()
