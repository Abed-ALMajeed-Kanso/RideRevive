export interface Product {
    _id: string;
    Product_ID: string;
    Product: string;
    Product_price: number;
    Product_state: boolean;
    Product_amount: number;
    Product_current_amount: number;
    Category: string;
    Product_image: string;
    Product_Discount: number;
    Product_Date: string; 
    Ordered_Product_Amount?: number; 
}