from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_users: int = 0
    total_products: int = 0
    total_orders: int = 0
    total_revenue: int = 0
    pending_reviews: int = 0


class RoleUpdate(BaseModel):
    role: str
