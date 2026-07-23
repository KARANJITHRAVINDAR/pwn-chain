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
            "name": "Hair Oil",
            "slug": "hair-oil",
            "tagline": "Nourishing botanical blend for lustrous locks",
            "description": "Our Hair Oil is crafted from a blend of rare botanical extracts that penetrate deep into the scalp to nourish, strengthen, and revitalize every strand.",
            "price": 499,
            "original_price": 699,
            "category": "hair",
            "sizes": '["50ml", "100ml", "200ml"]',
            "ingredients": "Coconut Oil, Argan Oil, Castor Seed Oil, Rosemary Leaf Extract, Vitamin E, Lavender Essential Oil.",
            "how_to_use": "Apply 5-6 drops to your scalp and massage gently. Leave on for at least 30 minutes or overnight. Wash off with a mild shampoo. Use 2-3 times a week.",
            "image_url": "/assets/images/products/hair-oil-main.jpg",
            "in_stock": True,
            "stock_quantity": 50,
            "is_featured": True,
        },
        {
            "name": "Hair Pack",
            "slug": "hair-pack",
            "tagline": "Deep conditioning mask for silky smooth hair",
            "description": "Our Hair Pack is a luxurious deep conditioning treatment infused with natural clays and botanical oils to restore moisture, reduce frizz, and add brilliant shine.",
            "price": 399,
            "original_price": 549,
            "category": "hair",
            "sizes": '["100g", "200g"]',
            "ingredients": "Kaolin Clay, Shea Butter, Aloe Vera, Hydrolyzed Keratin, Pro-Vitamin B5.",
            "how_to_use": "Apply generously to damp hair from roots to tips. Leave on for 20-30 minutes. Rinse thoroughly with lukewarm water.",
            "image_url": "/assets/images/products/hair-pack-main.jpg",
            "in_stock": True,
            "stock_quantity": 30,
            "is_featured": True,
        },
        {
            "name": "Face Pack",
            "slug": "face-pack",
            "tagline": "Brightening clay mask for radiant, clear skin",
            "description": "Our Face Pack combines the purifying power of natural clays with the brightening effects of turmeric and vitamin C for clear, glowing skin.",
            "price": 349,
            "original_price": 499,
            "category": "face",
            "sizes": '["50g", "100g"]',
            "ingredients": "Kaolin Clay, Multani Mitti, Turmeric Root Powder, Sandalwood Powder, Rose Petal Powder, Orange Peel Powder.",
            "how_to_use": "Mix 1-2 teaspoons with rose water or plain water. Apply evenly to cleansed face. Leave for 15-20 minutes. Rinse off with lukewarm water.",
            "image_url": "/assets/images/products/face-pack-main.jpg",
            "in_stock": True,
            "stock_quantity": 40,
            "is_featured": True,
        },
        {
            "name": "Face Serum",
            "slug": "face-serum",
            "tagline": "Hydrating vitamin-C serum for youthful glow",
            "description": "Our Face Serum is a potent blend of Vitamin C, hyaluronic acid, and plant extracts that work synergistically to brighten, hydrate, and firm your skin.",
            "price": 599,
            "original_price": 799,
            "category": "face",
            "sizes": '["15ml", "30ml"]',
            "ingredients": "Vitamin C (Ascorbic Acid), Sodium Hyaluronate, Niacinamide, Glycerin, Centella Asiatica Extract, Rosehip Seed Oil.",
            "how_to_use": "After cleansing, apply 3-4 drops to face and neck. Gently press into skin. Follow with moisturizer. Use morning and evening.",
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
